const fs = require('fs');
const parse5 = require('parse5');

const FILE_NAME = './MovimentiContoCorrenteArancio.xls';

const transactions = parse5
  .parse(fs.readFileSync(FILE_NAME, 'utf8'))
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

console.log(qif);
