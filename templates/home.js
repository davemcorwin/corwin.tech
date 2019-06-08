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

module.exports = ({ csrfToken, devices }) => `
  <html lang="en-US">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Home</title>
      <link rel="stylesheet" type="text/css" href="/assets/styles.css" />
      <meta name="csrf-token" content="${csrfToken}" />
    </head>
    <body>
      <main>
        <h1>Home</h1>
        <form>
          ${devices.map(switchHtml).join('')}
        </form>
      </main>
      <script type="text/javascript" src="/assets/relay-state.js"/></script>        
    </body>
  </html>
`;
