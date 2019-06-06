const { getDevices } = require('../lib/tplink-api');

module.exports = async (req, res) => {
  const devices = await getDevices();
  res.end(JSON.stringify(devices));
};
