import AWS from 'aws-sdk';

const { AWS_REGION, AUDITS_BUCKET, AUDITS_TABLE } = process.env;

const s3 = new AWS.S3({
    apiVersion: `2006-03-01`,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient({
    apiVersion: `2012-10-08`,
    region: AWS_REGION,
});

const uploadLighthouseJson = async (key, body, options = {}) => {
    const response = await s3
        .upload({
            Bucket: AUDITS_BUCKET,
            Key: `${key}`,
            Body: body,
            ContentType: `application/json; charset=utf-8`,
            CacheControl: `public, max-age=604800, immutable`,
            ...options,
        })
        .promise();
    return {
        key: response.Key,
        location: response.Location,
        type: 'LHJSON',
    };
};

const getLighthouseJson = async (key) => {
    const response = await s3
        .getObject({
            Bucket: AUDITS_BUCKET,
            Key: key,
        })
        .promise();
    return JSON.parse(response.Body.toString());
};

const insertAudit = async (data) => {
    const now = new Date(data.created_at);
    const expires_at = new Date(now.setYear(now.getFullYear() + 2));
    await dynamoDB
        .put({
            TableName: AUDITS_TABLE,
            Item: {
                ...data,
                expires_at: Math.floor(expires_at.getTime() / 1000),
                created_at: now.toUTCString(),
            },
        })
        .promise();
};

const getAudit = async (id) => {
    return await dynamoDB
        .get({
            TableName: AUDITS_TABLE,
            Key: {
                id,
            },
        })
        .promise();
};

export { s3, dynamoDB, uploadLighthouseJson, insertAudit, getAudit, getLighthouseJson };
