const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
const form = document.forms[0];
form.addEventListener('change', async event => {
  const deviceId = event.target.dataset.deviceId;
  const state = event.target.checked ? 'on' : 'off';
  try {
    const response = await fetch(`/api/set-relay-state/${deviceId}/${state}`, {
      credentials: 'same-origin',
      headers: {
        'CSRF-Token': csrfToken,
      },
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
  } catch (err) {
    alert(err.message);
  }
});
