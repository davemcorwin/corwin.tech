const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const express = require('express');
const basicAuth = require('express-basic-auth');
const helmet = require('helmet');
const { getDevice, getDevices } = require('../lib/tplink-api');
const template = require('../templates/home');

const { USER, PASS } = process.env;

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
      },
    },
  })
);
app.use(
  basicAuth({
    users: { [USER]: PASS },
    challenge: true,
    realm: 'Corwin.tech',
  })
);
app.use(cookieParser());
app.use(csrf({ cookie: true }));

app.get('*', async (req, res) => {
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

  res.set('Content-Type', 'text/html');
  res.send(template({ csrfToken: req.csrfToken(), devices }));
});

module.exports = app;
