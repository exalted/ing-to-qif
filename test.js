#!/usr/bin/env node

const fs = require('fs');
const { convertToQIF } = require('./netlify/functions/convert');

// USAGE: ./test.js <example.xls>
const path = process.argv[2];

const html = fs.readFileSync(path, { encoding: 'utf8' });
const qif = convertToQIF(html);

console.log(qif);
