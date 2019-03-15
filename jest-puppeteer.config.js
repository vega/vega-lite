module.exports = {
  launch: {
    headless: true,
    dumpio: true
  },
  server: {
    command: 'node ./node_modules/.bin/http-server -s -p 8000'
  }
};
