const { getDevice, getDevices } = require('../lib/tplink-api');

const switchHtml = device => `
  <label class="switch ${device.status === 0 && 'disabled'}" for="${device.alias}">
    ${device.alias}
    <input
      type="checkbox"
      id="${device.alias}"
      name="${device.alias}"
      data-device-id="${device.deviceId}"
      data-device-url="${device.appServerUrl}"
      ${device.relay_state === 1 ? 'checked' : ''}
    />
    <div class="slider-container">
      <div class="slider"></div>
    </div>
  </label>
`;

module.exports = async (req, res) => {
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

  const switchesHtml = devices.map(switchHtml).join('');

  res.end(`
    <html lang="en-US">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Home</title>
        <link rel="stylesheet" type="text/css" href="/assets/styles.css" />
      </head>
      <body>
        <main>
          <h1>Home</h1>
          <form>
            ${switchesHtml}
          </form>
        </main>
        <script>
          const form = document.forms[0];
          form.addEventListener('change', event => {
            const url = [
              '/api/set-relay-state/',
              event.target.dataset.deviceId,
              '/',
              event.target.checked ? 'on' : 'off'
            ].join('');
            fetch(url, { method: 'POST' });
          });
        </script>        
      </body>
    </html>
  `);
};
