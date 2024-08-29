import * as cdk from "aws-cdk-lib"
import { aws_lambda, Fn, StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { ApiDefinition, SpecRestApi } from "aws-cdk-lib/aws-apigateway"
import { Asset } from "aws-cdk-lib/aws-s3-assets"
import * as path from "path"
import { CfnRole, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam"
import { CfnFunction, SnapStartConf } from "aws-cdk-lib/aws-lambda"

interface ApiStackProps extends StackProps {
  version: string
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: ApiStackProps) {
    super(scope, id, props)

    // Lambda
    const lambda = new aws_lambda.Function(this, "HelloWorldLambda", {
      runtime: aws_lambda.Runtime.JAVA_21,
      handler: "se.omegapoint.HelloWorldHandler",
      code: aws_lambda.Code.fromAsset(path.join(__dirname, `../../target/op-invent-java-lambda-${props?.version}-SNAPSHOT.jar`)),
      memorySize: 2048,
      snapStart: SnapStartConf.ON_PUBLISHED_VERSIONS,
    })

    ;(lambda.node.defaultChild as CfnFunction).overrideLogicalId("HelloWorldLambda")

    lambda.addAlias("current")

    // Role
    const apiRole = new Role(this, "ApiLambdaRole", {
      assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
    })

    ;(apiRole.node.defaultChild as CfnRole).overrideLogicalId("ApiLambdaRole")

    lambda.grantInvoke(apiRole)

    // Api Gateway
    const apiAsset = new Asset(this, "ApiSpecAsset", {
      path: path.join("../api/hello-world-v1.yaml"),
    })
    const apiData = Fn.transform("AWS::Include", { location: apiAsset.s3ObjectUrl })

    new SpecRestApi(this, "HelloWorldApi", {
      apiDefinition: ApiDefinition.fromInline(apiData),
    })
  }
}
