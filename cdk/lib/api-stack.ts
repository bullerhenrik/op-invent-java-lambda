import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { aws_lambda, StackProps } from 'aws-cdk-lib'
import { OpenApiGatewayToLambda } from '@aws-solutions-constructs/aws-openapigateway-lambda'
import { Asset } from 'aws-cdk-lib/aws-s3-assets'
import * as path from 'path'
import { Alias, SnapStartConf } from 'aws-cdk-lib/aws-lambda'

interface ApiStackProps extends StackProps {
  version: string
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props)

    const lambda = new aws_lambda.Function(this, 'HelloWorldHandler', {
      runtime: aws_lambda.Runtime.JAVA_21,
      handler: 'se.omegapoint.HelloWorldHandler',
      code: aws_lambda.Code.fromAsset(path.join(__dirname, `../../target/op-invent-java-lambda-${props?.version}-SNAPSHOT.jar`)),
      memorySize: 2048,
      snapStart: SnapStartConf.ON_PUBLISHED_VERSIONS,
    })

    lambda.addAlias('current')

    new OpenApiGatewayToLambda(this, 'HelloWorldAPI', {
      apiDefinitionAsset: new Asset(this, 'HelloWorldApiSpecAsset', {
        path: path.join('../api/hello-world-v1.yaml'),
      }),
      apiIntegrations: [
        {
          id: 'HelloWorldHandler', //Replaces uri placeholder in API-spec
          existingLambdaObj: lambda,
        },
      ],
    })
  }
}
