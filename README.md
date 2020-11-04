# Serverless Typescript AWS

This is a Serverless project example using Typescript, ready for [AWS Lambda](https://aws.amazon.com/lambda) and [API Gateway](https://aws.amazon.com/api-gateway/).

You need to have an AWS account, to create a dedicated IAM User with credentials so Serverless can deploy your app. ([Configure AWS credentials](#configure-aws-credentials-quick-way))

## Stack

- [Node.js](https://nodejs.org/en/) 12x
- [Serverless](https://serverless.com/framework/docs/)
- [Typescript](https://www.typescriptlang.org/) (> 3.8) for type checking.

## What IaC to use ?

https://acloudguru.com/blog/engineering/cloudformation-terraform-or-cdk-guide-to-iac-on-aws
https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html
https://serverless-stack.com/chapters/using-aws-cdk-with-serverless-framework.html

## Performance Tuning:

[Tune up your lambda](https://github.com/alexcasalboni/aws-lambda-power-tuning)

## Using Breakpoints:

[How to setup debugging and breakpoints](https://levelup.gitconnected.com/debugging-nodejs-lambda-functions-locally-with-breakpoints-dfb1e2e3c77d)

Note: Follow the instrunctions above ^ but use these launch.json configurations:

````json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug",
      "type": "pwa-node",
      "request": "launch",
      "cwd": "${workspaceRoot}",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run-script", "debug"],
      "resolveSourceMapLocations": ["${workspaceFolder}/**", "!**/node_modules/**"]
    }
  ]
}

When you run the debugger, you should see the routes for you to invoke using Postman:
```txt
offline: Offline [http for lambda] listening on http://localhost:3002
node_modules/serverless/lib/classes/CLI.js:419
offline: Function names exposed for local invocation by aws-sdk:
           * extract: getCovidDataFromSourcesAndMerge-dev-extract
node_modules/serverless/lib/classes/CLI.js:419
[offline] Lambda Invocation Routes (for AWS SDK or AWS CLI):
           * POST http://localhost:3002/2015-03-31/functions/getCovidDataFromSourcesAndMerge-dev-extract/invocations
node_modules/serverless-offline/dist/lambda/HttpServer.js:79
[offline] Lambda Async Invocation Routes (for AWS SDK or AWS CLI):
           * POST http://localhost:3002/2014-11-13/functions/getCovidDataFromSourcesAndMerge-dev-extract/invoke-async/
````

```

## Bugs

```

warning Error running install script for optional dependency: "E:\\Users\\roberto\\Documents\\workspace\\Serverless\\CovidServerlessDataLake\\node_modules\\snappy: Command failed.
Exit code: 1
Command: prebuild-install || node-gyp rebuild
Arguments:
Directory: E:\\Users\\roberto\\Documents\\workspace\\Serverless\\CovidServerlessDataLake\\node_modules\\snappy
Output:
prebuild-install WARN install No prebuilt binaries found (target=12.18.4 runtime=node arch=x64 libc= platform=win32)

C\bL\bI\bN\bK\b \bE:\\Users\\roberto\\Documents\\workspace\\Serverless\\CovidServerlessDataLake\\node_modules\\snappy>if not defined npm_config_node_gyp (node \"C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\node-gyp-bin\\\\..\\..\\node_modules\\node-gyp\\bin\\node-gyp.js\" rebuild ) else (node \"\" rebuild )
gyp info it worked if it ends with ok
gyp info using node-gyp@5.1.0
gyp info using node@12.18.4 | win32 | x64
gyp ERR! find Python

````

[Solution] (https://github.com/felixrieseberg/windows-build-tools/issues/56): (Run PowerShell as Admin. Solution takes awhile to finish)

```bash
npm --add-python-to-path='true' --debug install --global windows-build-tools
````

```
λ sls deploy
Serverless: Running "serverless" installed locally (in service node_modules)
Serverless: Bundling with Webpack...
Starting type checking service...
Using 1 worker with 2048MB memory limit
Time: 4212ms
Built at: 10/24/2020 11:44:05 PM
                         Asset      Size  Chunks                   Chunk Names
    lambda_function/extract.js  1.71 KiB       0  [emitted]        lambda_function/extract
lambda_function/extract.js.map  8.12 KiB       0  [emitted] [dev]  lambda_function/extract
Entrypoint lambda_function/extract = lambda_function/extract.js lambda_function/extract.js.map
[0] external "node-fetch" 42 bytes {0} [built]
[1] ./lambda_function/extract.ts 1.32 KiB {0} [built]
[2] external "source-map-support/register" 42 bytes {0} [built]
Serverless: WARNING: Could not determine version of module node-fetch
Serverless: Packing external modules: node-fetch, source-map-support@^0.5.10
Serverless: WARNING: Could not determine version of module node-fetch
```

[Solution] (https://github.com/serverless/serverless/issues/7566): Update serverless.yml

```yml
custom:
  webpack:
    webpackConfig: ./webpack.config.js
    includeModules: false
```

## IDE Setup

[VSCode](https://code.visualstudio.com/) is highly preferred. Please ensure you have installed these extensions:

- Prettier
- Eslint

---

### Add ESLint with Typescript support

[TypeScript ESLint](https://github.com/typescript-eslint/typescript-eslint/)

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

- Create `.eslintrc.js`

```js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: './',
    sourceType: 'module',
    ecmaVersion: 2019,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
```

- Create `.eslintignore` :

```text
node_modules
.serverless
.vscode
*.config.js
.webpack
**/*.js
```

### Add Prettier

[Prettier with linters](https://prettier.io/docs/en/integrating-with-linters.html)

```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

- Create `.prettierrc.js`

```js
module.exports = {
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'all',
};
```

- Create `.prettierignore`

```text
node_modules
.serverless
.webpack
```

- Update `.eslintrc.js` rules

```js
extends: [
  "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
  "plugin:prettier/recommended" // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
],
```

### Webpack

Enable Webpack plugin that runs TypeScript type checker on a separate process.

Update `webpack.config.js`

```js
plugins: [
  new ForkTsCheckerWebpackPlugin({
    eslint: true,
    eslintOptions: {
      cache: true,
    },
  }),
],
```

## NPM Scripts

Let's add some scripts for our application in `package.json`

```json
"scripts": {
  "lint": "eslint . --ext js,ts --cache --fix",
  "prettier": "prettier --list-different './**/*.{js,ts}'",
  "typecheck": "tsc --noEmit",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

Test them :

```bash
# linter
npm run lint

# prettier
npm run prettier

# type checking
npm run typecheck
```

## Configure AWS Credentials (Quick way)

This is the quick way to set up a user for Serverless.

Here is a better way : [Configure AWS Credentials (Better way)](#configure-aws-credentials-better-way)

### Create IAM user for Serverless

- Login to AWS and navigate to IAM
- Create a new user called serverless-deploy
- Give serverless-deploy Programatic access
- Attach the AdministratorAccess policy

## Deploy

```bash
# -v enables verbose output so you can see what happens
serverless deploy -v
```

Dev stage is assumed by default.

What do Serverless do ?

- Package our application (with Webpack)
- Creates a CloudFormation stack
- Create a S3 Bucket
- Upload the CloudFormation template to S3
- Upload our application package to S3
- Provisions the IAM Roles
- Provisions the Log Groups
- Provisions the ApiGateway end points
- Provisions the Lambda function our service

You can now invoke your service :

```bash
# -f specifies the function name, -l specifiesto output the logs to the console
serverless invoke -f hello -l
```

You can test it with your API Gateway end point : `https://xxxxxx.execute-api.us-east-1.amazonaws.com/dev`

## Delete your service

```bash
serverless remove
```

## Configure AWS Credentials (Better way)

### Create IAM user, IAM group and IAM Policy

Here we want to create a new IAM Policy, attach it to a new IAM group to which we will attach our new user.

Let's go to _Identity and Access Management (IAM)_ service and create a new User `serverless-deploy` with Programatic access.
Give it no permissions.

You can find how to use your user credentials with Serverless here : [Use your user credentials](#use-your-user-credentials)

Then try to deploy your serverless app

```bash
serverless deploy -v
```

You should get this error...

`serverless-deploy is not authorized to perform: cloudformation:DescribeStacks`

It's enough explicit :)  
So we now need to give this IAM User permission.

//

Let's go back to AWS Console, and create a new IAM Group `serverless-deploy-group` without any policy.

Let's now create a new IAM Policy :

- Create a new IAM Policy
- Add a policy for the CloudFormation service, allow _List:DescribeStacks_ action.
- Indicate to apply this permission to all resources and click _Review Policy_ button.  
  _(If necessary, you can specify specific ressources to apply the permissions)_
- Name this policy `serverless-deploy-policy` (just for consistency) and finish to create it.

Now go back to the group `serverless-deploy-group` we created and attach it this policy.  
Then go back to the user `serverless-deploy` and attach it to the group `serverless-deploy-group`.

Let's now try to deploy again

```bash
serverless deploy -v
```

Now you should have the following new error.

`serverless-deploy is not authorized to perform: cloudformation:CreateStack on resource`

We have to edit our policy and add some new permissions.

//

Go back to the `serverless-deploy-policy` policy we created, edit it and add the _CreateStack_ permission for CloudFormation service.

You can try to deploy again, and add each missing policy.  
This is the best way to be sure to add only the necessary permissions.  
Step by step, it will sometimes be necessary to delete resources manually to be able to test a deployment again.

### Basic policy example

For this example project, you can find the minimum permissions required here : [IAM.json](https://github.com/saybou/serverless-typescript-aws/blob/master/IAM.json)

## Add JEST for testing

WIP :)

## And now

Now it's your time !

Update your function, update your provider config, create new functions, and deploy your service(s) as you want :D
