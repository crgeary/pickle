import { getAudit, getLighthouseJson } from '../../aws';
import * as http from '../../http';

export const handler = async (event) => {
    const { pathParameters } = event;
    const { id } = pathParameters;

    let dynamoResponse,
        report = {};

    try {
        dynamoResponse = await getAudit(id);
    } catch (err) {
        console.error(err);
        return http.error(http.status.SERVER_ERROR, 'Unknown Error');
    }

    if (!('Item' in dynamoResponse)) {
        return http.json(http.status.NOT_FOUND, {
            message: `Audit not found for id: ${id}`,
        });
    }

    const audit = dynamoResponse.Item;

    if (audit.resources && Array.isArray(audit.resources)) {
        const resource = audit.resources.filter((a) => a.type === 'LHJSON').find(() => true);
        if (resource) {
            try {
                report = await getLighthouseJson(resource.key);
            } catch (err) {
                console.error(err);
            }
        }
    }

    return http.json(http.status.OK, {
        pickle: {
            id,
            resources: audit?.resources,
        },
        ...audit.response,
        lighthouseResult: {
            ...report,
        },
    });
};
