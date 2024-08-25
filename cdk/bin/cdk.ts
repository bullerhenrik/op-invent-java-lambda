#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { NewApiStack } from '../lib/new-api-stack'

const app = new cdk.App()

new NewApiStack(app, 'ApiStack', {
  version: '1.0',
})
