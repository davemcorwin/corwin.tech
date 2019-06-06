const { parse } = require('url');
const { getDevice } = require('../lib/tplink-api');

module.exports = async (req, res) => {
  const { deviceId } = parse(req.url, true).query;
  const device = await getDevice(deviceId);
  res.end(JSON.stringify(device));
};
