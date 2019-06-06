const { parse } = require('url');
const { setRelayState } = require('../lib/tplink-api');

module.exports = async (req, res) => {
  const { deviceId, state } = parse(req.url, true).query;
  await setRelayState(deviceId, state);
  res.end(`Success!`);
};
