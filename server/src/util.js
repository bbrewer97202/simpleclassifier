const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

/**
 * send normalized http response indicating a successful request
 * @param {Object} payload server response
 */
function respondSuccess(payload = {}) {
  const response = { data: payload, success: true };
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(response),
  };
}

/**
 * send normalized http response indicating a failed request
 * @param {Object} payload server response
 */
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
