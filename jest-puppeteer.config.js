module.exports = {
  launch: {
    headless: true,
    dumpio: true
  },
  server: {
    command: 'node ./node_modules/.bin/serve -l 8000',
    port: 8000
  }
};
