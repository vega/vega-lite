// from vega-cli

const {createReadStream} = require('fs');

module.exports = file => {
  return new Promise((resolve, reject) => {
    const input = file ? createReadStream(file) : process.stdin;
    let text = '';

    input.setEncoding('utf8');
    input.on('error', err => {
      reject(err);
    });
    input.on('data', chunk => {
      text += chunk;
    });
    input.on('end', () => {
      resolve(text);
    });
  });
};
