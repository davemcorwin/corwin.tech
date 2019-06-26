const Mailgun = require('mailgun-js');

const { MAILGUN_API_KEY, MAILGUN_DOMAIN } = process.env;

const sendError = text => {
  const mailgun = Mailgun({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN });
  const data = {
    from: 'Corwin.tech Support <no-reply@practicalporpoise.com>',
    to: 'dave@practicalporpoise.com',
    subject: 'Corwin.tech Error',
    text,
  };

  return new Promise(resolve => {
    mailgun.messages().send(data, (error, body) => {
      resolve();
    });
  });
};

module.exports = { sendError };
