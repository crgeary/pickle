# Pickle

Extend the shelf life of PageSpeed Insights reports 🥒

---

PageSpeed Insights is a fantastic tool for gathering a quick overview of common page performance issues. Simply provide a URL and within seconds you have a report of actionable recommendations and key performance metrics.

Unfortunately, those reports cannot be shared, downloaded or accessed in the future. This is where Pickle comes in. Pickle is a wrapper around the PageSpeed Insights API which automatically stores reports, and makes them available & shareable for years to come.

## Usage

Pickle replicates the same API request & response of [PageSpeed Insights](https://developers.google.com/speed/docs/insights/v5/reference/).

| Method | Route                              | Description                                  |
| ------ | ---------------------------------- | -------------------------------------------- |
| GET    | `/pagespeedonline/v5/runPagespeed` | Runs PageSpeed analysis on the specified URL |

Pickle further extends the PageSpeed Insights API by providing routes for accessing historical reports.

| Method | Route             | Description                                      |
| ------ | ----------------- | ------------------------------------------------ |
| GET    | `/audits`         | Query for existing PageSpeed reports             |
| POST   | `/audits`         | Runs PageSpeed analysis on the specified URL     |
| GET    | `/audits/{audit}` | Retrieve an existing PageSpeed report by it's ID |

The `POST /audits` route is an alias of the original `GET /pagespeedonline/v5/runPagespeed` route, but it provides a more REST like API.

## Architecture

Pickle is built for AWS. The architecture is **roughly** as described below. For a more in detailed description of the architecture, check out the [cloudformation template](./infrastructure/main.yml).

![Architecture of AWS services: API Gateway, Lambda, S3 & DynamoDB](./resources/architecture.png)

## Deploying

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
