import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';

export class BackendStack extends cdk.Stack {
  public readonly httpApi: apigwv2.HttpApi;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.httpApi = new apigwv2.HttpApi(this, 'PedalHubHttpApi', {
      apiName: 'pedalhub-http-api',
      description: 'HTTP API Serverless do e-commerce PedalHub',
      corsPreflight: {
        allowOrigins: [
          'https://pedal-hub-ecommerce.vercel.app',
          'http://localhost:5173',
          'http://localhost:4173',
        ],
        allowMethods: [
          apigwv2.CorsHttpMethod.GET,
          apigwv2.CorsHttpMethod.POST,
          apigwv2.CorsHttpMethod.OPTIONS,
        ],
        allowHeaders: ['Content-Type'],
        maxAge: cdk.Duration.days(1),
      },
    });
    new cdk.CfnOutput(this, 'ApibaseUrl', {
      value: this.httpApi.apiEndpoint,
      description: 'URL base da API HTTP do e-commerce PedalHub',
    });
  }
}
