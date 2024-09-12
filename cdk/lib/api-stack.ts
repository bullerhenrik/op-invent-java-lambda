import * as cdk from "aws-cdk-lib"
import { aws_lambda, StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { Asset } from "aws-cdk-lib/aws-s3-assets"
import * as path from "path"
import { SnapStartConf } from "aws-cdk-lib/aws-lambda"
import { OpenApiGatewayToLambda } from "./constructs/open-api-gateway-to-lambda"

interface ApiStackProps extends StackProps {
  version: string
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props)

    new OpenApiGatewayToLambda(this, "HelloWorldApi", {
      api: {
        id: "HelloWorldApiGateway",
        roleId: "ApiLambdaRole",
        apiDefinitionAsset: new Asset(this, "ApiSpecAsset", {
          path: path.join("../api/hello-world-v1.yaml"),
        }),
      },
      apiIntegration: [
        {
          id: "HelloWorldLambda",
          runtime: aws_lambda.Runtime.JAVA_21,
          handler: "se.omegapoint.HelloWorldHandler",
          code: aws_lambda.Code.fromAsset(path.join(__dirname, `../../target/op-invent-java-lambda-${props.version}-SNAPSHOT.jar`)),
          memorySize: 2048,
          snapStart: SnapStartConf.ON_PUBLISHED_VERSIONS,
          version: props.version,
        },
      ],
    })
  }
}
