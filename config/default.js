module.exports = {
  mysql: process.env.MYSQL_URI || 'mysql://localhost:3306/moodle',
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  facebookApiKey: process.env.FACEBOOK_API_KEY,
  port: process.env.PORT || 3000,
  errorEmails: process.env.ERROR_EMAILS.split(';'),
};
