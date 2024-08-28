![op_invent](op-invent-16x10_title.png)
# TL;DR

## Cold start before optimization: 6s
![img_2.png](img_2.png)

# 1. memorySize
## Use AWS Lambda Power Tuning to balances speed (duration) and cost.
![img_1.png](img_1.png)
_https://docs.aws.amazon.com/lambda/latest/operatorguide/profile-functions.html_

### Cold start time saved: ?

# 2. snapStart
### Cold start time saved: 3s

_https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html_

# 3. Priming/Dependency initialization
### Cold start time saved: 2s


- https://aws.amazon.com/blogs/compute/reducing-java-cold-starts-on-aws-lambda-functions-with-snapstart/

- https://peixotoo.medium.com/how-to-improve-aws-java-lambda-performance-in-80-84e3432e0327

- https://medium.com/i-love-my-local-farmer-engineering-blog/optimizing-your-java-lambda-cold-starts-and-initializations-5ca24de2c078_

# Result cold start ~1s

## Example using AWS CDK

API Gateway --> Lambda using 
`OpenApiGatewayToLambda` from @aws-solutions-constructs/aws-openapigateway-lambda


![img_5.png](img_5.png)
- https://docs.aws.amazon.com/solutions/latest/constructs/aws-openapigateway-lambda.html
- https://github.com/awslabs/aws-solutions-constructs/tree/main/source/patterns/%40aws-solutions-constructs/aws-apigateway-lambda
