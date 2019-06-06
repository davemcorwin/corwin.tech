// async function doStuff() {
//   const form = document.forms[0];
//   const devices = await fetch('/api/get-devices', {
//     headers: { 'Content-Type': 'application/json' },
//   }).then(response => response.json());

//   const switchesHtml = devices
//     .map(
//       device => `
//         <label class="switch" for="${device.alias}">
//         ${device.alias}
//         <input type="checkbox" id="${device.alias}" name="${device.alias}" ${
//         device.status === 1 ? '' : 'disabled'
//       } />
//         <div class="slider-container">
//         <div class="slider"></div>
//         </div>
//         </label>
//       `
//     )
//     .join('');

//   form.innerHTML = switchesHtml;
//   form.addEventListener('change', event => {
//     fetch(`/api/set-relay-state/${}/${event.target.checked ? 'on' : 'off'}`, {
//       method: 'POST',
//     });
//   });
// }

// if (document.readyState === 'loading') {
//   window.addEventListener('DOMContentLoaded', doStuff);
// } else {
//   doStuff();
// }
