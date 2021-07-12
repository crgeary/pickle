const response = (statusCode, body = '', headers = {}) => {
    return {
        isBase64Encoded: false,
        statusCode,
        body,
        headers,
    };
};

const json = (statusCode, body = {}, headers = {}) => {
    return response(statusCode, JSON.stringify(body), {
        'Content-Type': 'application/json',
        ...headers,
    });
};

const error = (statusCode, message) => {
    return json(statusCode, {
        error: {
            message: message,
        },
    });
};

const status = {
    OK: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
};

export { response, json, error, status };
