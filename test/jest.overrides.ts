const {warn, error} = console;

console.error = function (...args: [msg: string, msg2: string, ...rest: any[]]) {
  error.apply(console, args);
  const [msg, msg2] = args;
  throw new Error(`${msg}: ${msg2} -- Please remove unnecessary errors or use log.wrap to consume reasonable errors`);
};

console.warn = function (...args: [msg: string, msg2: string, ...rest: any[]]) {
  warn.apply(console, args);
  const [msg, msg2] = args;
  throw new Error(`${msg}: ${msg2} -- Please remove unnecessary errors or use log.wrap to consume reasonable errors`);
};

export {};
