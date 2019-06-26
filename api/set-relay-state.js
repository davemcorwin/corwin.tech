const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const express = require('express');
const { sendError } = require('../lib/send-error');
const { setRelayState } = require('../lib/tplink-api');

const app = express();

app.use(cookieParser());
app.use(csrf({ cookie: true }));

app.post('*', async (req, res, next) => {
  try {
    const { deviceId, state } = req.query;
    await setRelayState(deviceId, state);
    res.send(`Success!`);
  } catch (err) {
    next(err);
  }
});

app.use(async (err, _req, res, _next) => {
  await sendError(err.message);
  res.statusCode = 500;
  res.send(`Houston, we have a problem. ${err.message}`);
});

module.exports = app;
