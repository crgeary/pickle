import { v4 as uuidv4 } from 'uuid';

import psi from '../../psi';
import { uploadLighthouseJson, insertAudit } from '../../aws';
import * as http from '../../http';

let response;

export const handler = async (event) => {
    const { rawQueryString } = event;
    const id = uuidv4(),
        resources = [];

    console.log(`Passing request to PageSpeed Insights with id: [${id}]`);

    try {
        response = await psi.run(rawQueryString);
    } catch (err) {
        if (err.response) {
            return http.response(err.response.status, err.response.data, err.response.headers);
        } else {
            console.error(err);
            return http.error(http.status.SERVER_ERROR, 'Unknown Error');
        }
    }

    const { lighthouseResult, ...responseWithoutResult } = response.data;

    console.log(`Writing Lighthouse reports to S3 with prefix: [${id}]`);

    try {
        resources.push(await uploadLighthouseJson(`${id}/lighthouse.json`, JSON.stringify(lighthouseResult)));
    } catch (err) {
        console.error(err);
        return http.error(http.status.SERVER_ERROR, 'Unknown Error');
    }

    console.log(`Inserting data into DynamoDB with id: [${id}]`);

    try {
        await insertAudit({
            id,
            url: lighthouseResult.finalUrl,
            created_at: lighthouseResult.fetchTime,
            response: responseWithoutResult,
            resources,
        });
    } catch (err) {
        console.error(err);
        return http.error(http.status.SERVER_ERROR, 'Unknown Error');
    }

    const body = {
        pickle: {
            id,
            resources,
        },
        ...response.data,
    };

    return http.json(response.status, body, response.headers);
};
