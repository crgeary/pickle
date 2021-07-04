import { v4 as uuidv4 } from 'uuid';

import psi from '../../psi';

export const handler = async (event) => {
    const { rawQueryString } = event;

    let response, id;

    try {
        response = await psi.run(rawQueryString);
        id = uuidv4();
    } catch (err) {
        if (err.response) {
            response = err.response;
        } else {
            console.error(err);
        }
    }

    return {
        isBase64Encoded: false,
        statusCode: response.status,
        headers: response.headers,
        body: JSON.stringify({
            audit_id: id,
            ...response.data,
        }),
    };
};
