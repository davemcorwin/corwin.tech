const request = require('request-promise-native');

const stringToBit = str => ('on' === str ? 1 : 'off' === str ? 0 : undefined);
const bitToString = bit => (1 === bit ? 'on' : 0 === bit ? 'off' : undefined);

const post = async requestData => {
  const { DEVICE_ID, TPLINK_TOKEN } = process.env;

  const options = {
    method: 'POST',
    uri: `https://use1-wap.tplinkcloud.com/?token=${TPLINK_TOKEN}`,
    body: {
      method: 'passthrough',
      params: {
        deviceId: `${DEVICE_ID}`,
        requestData: JSON.stringify(requestData),
      },
    },
    json: true,
  };

  const {
    result: { responseData },
  } = await request(options);

  return JSON.parse(responseData);
};

const tplinkApi = {
  async getSysInfo() {
    const {
      system: { get_sysinfo },
    } = await post({ system: { get_sysinfo: {} } });
    return get_sysinfo;
  },

  async getLightState() {
    const { relay_state } = await tplinkApi.getSysInfo();
    return bitToString(relay_state);
  },

  async setLightState(state) {
    return post({ system: { set_relay_state: { state: stringToBit(state) } } });
  },
};

module.exports = tplinkApi;
