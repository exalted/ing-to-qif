const parse5 = require('parse5');

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

// Content-Type: text/csv; charset=utf-8
// Content-Length: 52323
// X-Download-Options: noopen
// Content-Disposition: attachment; filename="bottega-assets-2022_02_19T17_48_41.csv"

exports.handler = async function (event, context) {
  // console.log(`event: ${JSON.stringify(event, null, 2)}`);
  // console.log(`context: ${JSON.stringify(context, null, 2)}`);

  const transactions = parse5
    .parse(Buffer.from(event.body, 'base64').toString('utf8'))
    .childNodes.find((x) => x.tagName === 'html')
    .childNodes.find((x) => x.tagName === 'body')
    .childNodes.find((x) => x.tagName === 'table')
    .childNodes.find((x) => x.tagName === 'tbody')
    .childNodes.filter((x) => x.tagName === 'tr')
    // because there are rows that don't contain transaction data:
    .filter((x) => x.childNodes.length === 5)
    .slice(1) // first row contains column headers
    .map((x) => ({
      '❌ Data contabile': x.childNodes[0].childNodes[0].value,
      'Data valuta': x.childNodes[1].childNodes[0].value,
      Causale: x.childNodes[2].childNodes[0].value,
      'Descrizione operazione': x.childNodes[3].childNodes[0].value,
      Importo: x.childNodes[4].childNodes[0].value, // '€ -43,20'
    }));

  const qif = `\
!Type:Bank
${transactions
  .map(
    (x) => `\
D${x['Data valuta']}
P${x['Causale']} - ${x['Descrizione operazione']}
M${x['Causale']} - ${x['Descrizione operazione']}
T${x['Importo']
      .replace(/[^-+0-9,]/g, '')
      .replace(/,/g, '#')
      .replace(/\./g, ',')
      .replace(/#/g, '.')}
^null
`,
  )
  .join('')}
`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/qif; charset=utf-8',
      // 'Content-Length': 52323,
      'Content-Disposition': 'attachment; filename="MovimentiContoCorrenteArancio.qif"',
    },
    body: qif,
  };
};
