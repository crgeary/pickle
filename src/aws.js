import AWS from 'aws-sdk';

const { AWS_REGION } = process.env;

const s3 = new AWS.S3({
    apiVersion: `2006-03-01`,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient({
    apiVersion: `2012-10-08`,
    region: AWS_REGION,
});

export { s3, dynamoDB };
