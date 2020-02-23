const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

function respondSuccess(payload = {}) {
  const response = { data: payload, success: true };
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(response),
  };
}

function respondFailure(payload = {}, statusCode = 200) {
  const response = { data: payload, success: false };
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(response),
  };
}

module.exports = {
  respondSuccess,
  respondFailure,
};
