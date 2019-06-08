const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const express = require('express');
const { setRelayState } = require('../lib/tplink-api');

const app = express();

app.use(cookieParser());
app.use(csrf({ cookie: true }));

app.post('*', async (req, res) => {
  const { deviceId, state } = req.query;
  await setRelayState(deviceId, state);
  res.send(`Success!`);
});

module.exports = app;
