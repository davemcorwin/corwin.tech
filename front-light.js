const { parse } = require('url');
const { setLightState } = require('./tplink-api');

module.exports = async (req, res) => {
  const { state } = parse(req.url, true).query;
  await setLightState(state);
  res.end(`Success!`);
};
