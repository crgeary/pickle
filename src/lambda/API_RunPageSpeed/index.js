import psi from '../../psi';

export const handler = async (event) => {
    const { rawQueryString } = event;
    let response;

    try {
        response = await psi.run(rawQueryString);
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
        body: JSON.stringify(response.data),
    };
};
