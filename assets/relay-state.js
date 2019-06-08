const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
const form = document.forms[0];
form.addEventListener('change', event => {
  const deviceId = event.target.dataset.deviceId;
  const state = event.target.checked ? 'on' : 'off';
  fetch(`/api/set-relay-state/${deviceId}/${state}`, {
    credentials: 'same-origin',
    headers: {
      'CSRF-Token': csrfToken,
    },
    method: 'POST',
  });
});
