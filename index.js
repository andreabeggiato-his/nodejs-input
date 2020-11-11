const readline = require('readline');

const readLinePromise = (prompt) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((fulfill) => {
    rl.question(`${prompt}: `, (answer) => {
      rl.close();
      fulfill(answer);
    });
  });
};

const parse = async (prompt, check, converter) => {
  let result;
  while(check(result)) {
    result = converter(await readLinePromise(prompt));
  }
  return result;
}

const readInteger = (prompt) => parse(prompt, isNaN, parseInt);

const readFloat = (prompt) => parse(prompt, isNaN, parseFloat);

const readString = (prompt) => parse(prompt, (r) => r == null, (r) => r);

const readIntegerArray = (prompt, separator = ',') => parse(
  prompt,
  (r) => r == null || r.some(a => isNaN(a)),
  (r) => {
    const splitted = r.split(separator);
    return splitted.map((s) => parseInt(s));
  }
);

const readFloatArray = (prompt, separator = ',') => parse(
  prompt,
  (r) => r == null || r.some(a => isNaN(a)),
  (r) => {
    const splitted = r.split(separator);
    return splitted.map((s) => parseFloat(s));
  }
);

const readStringArray = async (prompt, separator = ',') => (await readString(prompt)).split(separator);

module.exports = {
  readInteger,
  readFloat,
  readString,
  readIntegerArray,
  readFloatArray,
  readStringArray,
}