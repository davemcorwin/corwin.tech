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

module.exports = ({ devices }) => `
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
          ${devices.map(switchHtml).join('')}
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
`;
