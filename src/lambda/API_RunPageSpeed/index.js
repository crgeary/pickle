import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

import psi from '../../psi';

const s3 = new AWS.S3({
    apiVersion: `2006-03-01`,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient({
    apiVersion: `2012-10-08`,
    region: process.env.AWS_REGION,
});

export const handler = async (event) => {
    const { rawQueryString } = event;

    let response;
    const id = uuidv4();

    console.log(`Passing request to PageSpeed Insights with id: [${id}]`);

    try {
        response = await psi.run(rawQueryString);
    } catch (err) {
        if (err.response) {
            response = err.response;
        } else {
            console.error(err);
            return {
                isBase64Encoded: false,
                statusCode: 500,
                body: 'Unkown Error',
            };
        }
    }

    let s3response;

    console.log(`Writing Lighthouse reports to S3 with prefix: [${id}]`);

    try {
        s3response = await s3
            .upload({
                Bucket: process.env.AUDITS_BUCKET,
                Key: `${id}/lighthouse.json`,
                Body: JSON.stringify(response.data),
                ContentType: `application/json; charset=utf-8`,
                CacheControl: `public, max-age=604800, immutable`,
            })
            .promise();
    } catch (err) {
        console.error(err);
        return {
            isBase64Encoded: false,
            statusCode: 500,
            body: 'Unkown Error',
        };
    }

    const now = new Date(response.data?.lighthouseResult?.fetchTime);
    const expires_at = new Date(now.setYear(now.getFullYear() + 2));

    const resources = [
        {
            bucket: s3response.Bucket,
            key: s3response.Key,
            location: s3response.Location,
            type: 'LHJSON',
        },
    ];

    console.log(`Inserting data to DynamoDB with id: [${id}]`);

    try {
        await dynamoDB
            .put({
                TableName: process.env.AUDITS_TABLE,
                Item: {
                    id,
                    expires_at: Math.floor(expires_at.getTime() / 1000),
                    created_at: now.toUTCString(),
                    url: response.data?.lighthouseResult?.finalUrl,
                    resources,
                },
            })
            .promise();
    } catch (err) {
        console.error(err);
        return {
            isBase64Encoded: false,
            statusCode: 500,
            body: 'Unkown Error',
        };
    }

    return {
        isBase64Encoded: false,
        statusCode: response.status,
        headers: response.headers,
        body: JSON.stringify({
            pickle: {
                id,
                resources,
            },
            ...response.data,
        }),
    };
};
