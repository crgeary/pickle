import { s3, dynamoDB } from '../../aws';

export const handler = async (event) => {
    const { pathParameters } = event;
    const { id } = pathParameters;

    let dynamoResponse, s3response, report;

    try {
        dynamoResponse = await dynamoDB
            .get({
                TableName: process.env.AUDITS_TABLE,
                Key: {
                    id,
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

    if (!('Item' in dynamoResponse)) {
        return {
            isBase64Encoded: false,
            statusCode: 404,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Audit not found for id: ${id}`,
            }),
        };
    }

    const audit = dynamoResponse.Item;

    if (audit.resources && Array.isArray(audit.resources)) {
        const resource = audit.resources.filter((a) => a.type === 'LHJSON').find(() => true);
        if (resource) {
            try {
                s3response = await s3
                    .getObject({
                        Bucket: resource.bucket,
                        Key: resource.key,
                    })
                    .promise();
                report = JSON.parse(s3response.Body.toString());
            } catch (err) {
                console.error(err);
            }
        }
    }

    if (!report) {
        report = {};
    }

    return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pickle: {
                id,
                resources: audit?.resources,
            },
            ...report,
        }),
    };
};
