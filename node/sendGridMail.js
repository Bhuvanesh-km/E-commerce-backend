const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: "bhuvaneshprime@gmail.com",
  from: "xlrd2973@gmail.com", // this email should be verified in sendgrid
  subject: "Testing email",
  text: "This is a test email",
  html: "<strong>This is a test email</strong>",
};

sgMail
  .send(msg)
  .then(() => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error(error);
  });
