const { parse } = require('url');
const { sendError } = require('../lib/send-error');
const sunApi = require('../lib/sun-api');
const { getRelayState, setRelayState } = require('../lib/tplink-api');

const { API_KEY } = process.env;

const SCHEDULE = [
  ['00:01', 'off'],
  ['05:00', 'on'], // Sunrise is never before 5am in 2019 Seattle
  ['sunrise', 'off'],
  ['sunset', 'on'],
].reverse(); // We iterate in reverse order

const dateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const timeFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles',
  hour12: false,
  hour: 'numeric',
  minute: 'numeric',
});

module.exports = async (req, res) => {
  try {
    const { deviceId, token } = parse(req.url, true).query;

    if (token !== API_KEY) {
      res.writeHead(401);
      return res.end();
    }

    let message = 'No op';
    const log = {};

    const currentDate = dateFormat.format();
    const currentTime = timeFormat.format();

    log.currentDate = currentDate;
    log.currentTime = currentTime;

    const [currentState, sunData] = await Promise.all([
      getRelayState(deviceId),
      sunApi(currentDate).then(({ sunrise, sunset }) => ({
        sunrise: timeFormat.format(new Date(sunrise)),
        sunset: timeFormat.format(new Date(sunset)),
      })),
    ]);

    log.currentState = currentState;
    log.sunrise = sunData.sunrise;
    log.sunset = sunData.sunset;

    const item = SCHEDULE.find(([timeStr]) => {
      let _timeStr = timeStr;
      if (['sunrise', 'sunset'].indexOf(timeStr) > -1) {
        _timeStr = sunData[timeStr];
      }
      return currentTime > _timeStr;
    });

    if (item) {
      log.item = item;
      const lightState = item[1];
      if (lightState !== currentState) {
        await setRelayState(deviceId, lightState);
        message = `Front light turned ${lightState}!`;
      }
    }
    log.message = message;

    console.log(log);

    return res.end(message);
  } catch (err) {
    await sendError(err.message);
    return res.end(err.message);
  }
};
