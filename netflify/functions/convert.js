// Netlify provides the event and context parameters when the function is
// invoked. When you call a function’s endpoint, the handler receives an event
// object similar to the following:
// {
//   "path": "Path parameter (original URL encoding)",
//   "httpMethod": "Incoming request’s method name",
//   "headers": {Incoming request headers},
//   "queryStringParameters": {Query string parameters},
//   "body": "A JSON string of the request payload",
//   "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encoded"
// }
// -----------------------------------------------------------------------------
// Synchronous functions can return a response object that includes the
// following information:
// {
//   "isBase64Encoded": true|false,
//   "statusCode": httpStatusCode,
//   "headers": { "headerName": "headerValue", ... },
//   "multiValueHeaders": { "headerName": ["headerValue", "headerValue2", ...], ... },
//   "body": "..."
// }
//
exports.handler = async function (event, context) {
  console.log(`event: ${JSON.stringify(event, null, 2)}`);
  console.log(`context: ${JSON.stringify(context, null, 2)}`);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
  };
}
