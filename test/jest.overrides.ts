const {warn, error} = console;

console.error = function (msg: string, msg2: string) {
  // eslint-disable-next-line prefer-rest-params
  error.apply(console, arguments);
  throw new Error(`${msg}: ${msg2} -- Please remove unnecessary errors or use log.wrap to consume reasonable errors`);
};

console.warn = function (msg: string, msg2: string) {
  // eslint-disable-next-line prefer-rest-params
  warn.apply(console, arguments);
  throw new Error(`${msg}: ${msg2} -- Please remove unnecessary errors or use log.wrap to consume reasonable errors`);
};
