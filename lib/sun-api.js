const request = require('request-promise-native');

const LAT = '47.785490';
const LONG = '-122.201760';

module.exports = async date => {
  const d = date || 'today';
  const options = {
    uri: `https://api.sunrise-sunset.org/json?lat=${LAT}&lng=${LONG}&date=${d}&formatted=0`,
    json: true,
  };

  const { results } = await request(options);
  return results;
};
