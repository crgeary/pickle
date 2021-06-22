export const handler = async () => {
    return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            status: 'COMPLETE',
        }),
    };
};
