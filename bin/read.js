// from vega-cli

import {createReadStream} from 'fs';
import {stdin} from 'process';

export default function read(file) {
  return new Promise((resolve, reject) => {
    const input = file ? createReadStream(file) : stdin;
    let text = '';

    input.setEncoding('utf8');
    input.on('error', (err) => {
      reject(err);
    });
    input.on('data', (chunk) => {
      text += chunk;
    });
    input.on('end', () => {
      resolve(text);
    });
  });
}
