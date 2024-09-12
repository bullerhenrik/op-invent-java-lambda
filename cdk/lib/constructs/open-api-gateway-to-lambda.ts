import { Construct } from "constructs"
import { CfnFunction, Code, Runtime, SnapStartConf } from "aws-cdk-lib/aws-lambda"
import { CfnRole, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam"
import { Asset } from "aws-cdk-lib/aws-s3-assets"
import { ApiDefinition, SpecRestApi } from "aws-cdk-lib/aws-apigateway"
import { aws_lambda, Fn } from "aws-cdk-lib"

interface ApiIntegration {
  /** Id of the ApiIntegration, used to correlate this lambda function to the api integration in the open api definition. */
  id: string
  runtime: Runtime
  handler: string
  code: Code
  snapStart?: SnapStartConf
  memorySize?: number
  version: string
}

interface OpenApiGatewayToLambdaProps {
  api: {
    id: string
    /** Id of the API role, used to correlate the role created to the api integration credentials in the open api definition. */
    roleId: string
    /** Local file asset of the OpenAPI spec file. */
    apiDefinitionAsset: Asset
  }
  apiIntegrations: ApiIntegration[]
}

export class OpenApiGatewayToLambda extends Construct {
  constructor(scope: Construct, id: string, props: OpenApiGatewayToLambdaProps) {
    super(scope, id)

    const apiRole = new Role(this, props.api.roleId, {
      assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
    })

    ;(apiRole.node.defaultChild as CfnRole).overrideLogicalId(props.api.roleId)

    props.apiIntegrations.map((apiIntegration) => {
      const lambda = new aws_lambda.Function(this, apiIntegration.id, {
        runtime: apiIntegration.runtime,
        handler: apiIntegration.handler,
        code: apiIntegration.code,
        memorySize: apiIntegration.memorySize ?? undefined,
        snapStart: apiIntegration.snapStart ?? undefined,
      })

      ;(lambda.node.defaultChild as CfnFunction).overrideLogicalId(apiIntegration.id)
      lambda.addAlias("current")
      lambda.grantInvoke(apiRole)

      return lambda
    })

    const apiData = Fn.transform("AWS::Include", { location: props.api.apiDefinitionAsset.s3ObjectUrl })

    new SpecRestApi(this, props.api.id, {
      apiDefinition: ApiDefinition.fromInline(apiData),
    })
  }
}
