const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

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

const readKeystroke = async (prompt) => {
  if (prompt) {
    process.stdout.write(`${prompt}: `);
  }

  const keyPressedPromise = new Promise((fulfill) => { 
    process.stdin.resume(); 
    const keyPressHandler = (str, key) => {
      if (key.ctrl && key.name === 'c') {
        process.exit();
      }
      else {
        process.stdin.off('keypress', keyPressHandler);
        process.stdin.pause();
        fulfill(key);
      }
    }
    process.stdin.on('keypress', keyPressHandler);
  });

  return keyPressedPromise;
}

const readKeystrokeForever = (callback) => {
  process.stdin.resume(); 
  const keyPressHandler = (str, key) => {
    if (key.ctrl && key.name === 'c') {
      process.exit();
    }
    else {
      callback(key);
    }
  }
  process.stdin.on('keypress', keyPressHandler);
  return () => {
    process.stdin.off('keypress', keyPressHandler);
    process.stdin.pause();
  }
}

module.exports = {
  readInteger,
  readFloat,
  readString,
  readIntegerArray,
  readFloatArray,
  readStringArray,
  readKeystroke,
  readKeystrokeForever,
}