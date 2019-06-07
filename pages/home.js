const auth = require('basic-auth');
const { getDevice, getDevices } = require('../lib/tplink-api');
const template = require('../templates/home');

const { USER, PASS } = process.env;

module.exports = async (req, res) => {
  const user = auth(req);

  if (!user || user.name !== USER || user.pass !== PASS) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="Corwin.tech"');
    return res.end('Access denied');
  }

  const deviceSummaries = await getDevices();
  const devices = await Promise.all(
    deviceSummaries.map(deviceSummary =>
      getDevice(deviceSummary.deviceId)
        .then(device => ({ ...deviceSummary, ...device }))
        .catch(err => {
          console.error(err);
          return deviceSummary;
        })
    )
  );
  res.end(template({ devices }));
};
