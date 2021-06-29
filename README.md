# Pickle

Extend the shelf life of PageSpeed Insights reports 🥒

## Routes

-   **GET** `/pagespeedonline/v5/runPagespeed` - Create a new audit (alias of POST `/audits`)
-   **GET** `/audits` - List existing audits
-   **POST** `/audits` - Create a new audit
-   **GET** `/audits/{audit}` - Get a single audit by ID

## Architecture

![Architecture of AWS services: API Gateway, Lambda, S3 & DynamoDB](./resources/architecture.png)

## Deployments

You will need an S3 bucket to store deployment artifacts. You can create one with:

```sh
aws s3 mb s3://{bucket_name}
```

Then use that bucket name to deploy with:

```sh
ARTIFACT_BUCKET={bucket_name} ./scripts/deploy.sh
```

## Licence

[MIT](./LICENSE)
