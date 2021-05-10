const readline = require('readline');

const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

read.question('Input String: ', (inputString) => {
    const reverse = inputString.split(' ').map(e => e.split('').reverse().join('')).reverse().join(' ')
    console.log(reverse)
    read.close();
  });