const request = require('request-promise-native');

const stringToBit = str => ('on' === str ? 1 : 'off' === str ? 0 : undefined);
const bitToString = bit => (1 === bit ? 'on' : 0 === bit ? 'off' : undefined);

const deviceBody = (deviceId, requestData) => ({
  method: 'passthrough',
  params: {
    deviceId,
    requestData: JSON.stringify(requestData),
  },
});

const post = async body => {
  const { TPLINK_TOKEN } = process.env;

  const options = {
    method: 'POST',
    uri: `https://use1-wap.tplinkcloud.com/?token=${TPLINK_TOKEN}`,
    body,
    json: true,
  };

  const response = await request(options);

  if (response.error_code !== 0) {
    return response.msg;
  }

  return JSON.parse(response.result.responseData);
};

const tplinkApi = {
  async getDevices() {
    const { TPLINK_TOKEN } = process.env;

    const options = {
      method: 'POST',
      uri: `https://wap.tplinkcloud.com/?token=${TPLINK_TOKEN}`,
      body: {
        method: 'getDeviceList',
      },
      json: true,
    };

    const { result } = await request(options);

    return result.deviceList;
  },

  async getDevice(deviceId) {
    const body = deviceBody(deviceId, { system: { get_sysinfo: {} } });

    const response = await post(body);

    if (typeof response === 'string') {
      throw new Error(response);
    }

    return response.system.get_sysinfo;
  },

  async getRelayState(deviceId) {
    const { relay_state } = await tplinkApi.getDevice(deviceId);

    return bitToString(relay_state);
  },

  async setRelayState(deviceId, stateStr) {
    const state = stringToBit(stateStr);
    const body = deviceBody(deviceId, { system: { set_relay_state: { state } } });

    const response = await post(body);

    if (typeof response === 'string') {
      throw new Error(response);
    }

    return response;
  },
};

module.exports = tplinkApi;
