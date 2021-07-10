import { s3 } from '../../aws';

const remove = async (id) => {
    const listOptions = {
        Bucket: process.env.AUDITS_BUCKET,
        Prefix: `${id}/`,
    };

    console.log(`Deleting objects for audit [${id}].`);

    const objects = await s3.listObjects(listOptions).promise();

    if (0 === objects.Contents.length) {
        console.log(`No objects found for prefix: [${listOptions.Prefix}].`);
        return;
    }

    const deleteOptions = {
        Bucket: process.env.AUDITS_BUCKET,
        Delete: {
            Objects: [],
        },
    };

    console.log(`Found ${objects.Contents.length} to delete for prefix: [${listOptions.Prefix}]`);

    objects.Contents.forEach((content) => {
        deleteOptions.Delete.Objects.push({
            Key: content.Key,
        });
    });

    const deletedObjects = await s3.deleteObjects(deleteOptions).promise();

    console.log(`Deleted ${deletedObjects.Deleted.length} for for prefix: [${listOptions.Prefix}].`);

    if (objects.IsTruncated) {
        await remove(id);
    }
};

export const handler = async (event) => {
    try {
        for (const record of event.Records) {
            if (`REMOVE` === record.eventName) {
                await remove(record.dynamodb.Keys.id.S);
            }
        }
    } catch (error) {
        console.error(error);
    }
};
