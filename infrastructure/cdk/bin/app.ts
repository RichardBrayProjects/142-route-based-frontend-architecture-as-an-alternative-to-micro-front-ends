import * as cdk from "aws-cdk-lib";
import { ToyFrontendStack } from "../lib/toy-frontend-stack";

const app = new cdk.App();

new ToyFrontendStack(app, "ToyFrontendStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});
