const nodeMailer = require("nodemailer");
require("dotenv").config();

const transporter = nodeMailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendMail = async (mailDetails, callback) => {
  try {
    const info = await transporter.sendMail(mailDetails);
    callback(info);
  } catch (error) {
    console.log(error);
  }
};

const HTML_TEMPLATE = (text) => {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>NodeMailer Email Template</title>
          <style>
            .container {
              width: 100%;
              height: 100%;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .email {
              width: 80%;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
            }
            .email-header {
              background-color: #333;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
            .email-body {
              padding: 20px;
            }
            .email-footer {
              background-color: #333;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email">
              <div class="email-header">
                <h2>OTP to reset password</h2>
              </div>
              <div class="email-body">
                <p>${text}</p>
              </div>
              <div class="email-footer">
                <p>Please do not share your login details with anyone as sharing it will give them complete access to your account.</p>
              </div>
              <div> 
                <p> This is auto generated email. Do not reply to this email. </p>
              </div>
              <div> 
                <p>© 2024 E-commerce. All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
};

// const message =
//   "Hi there, this is a test email, yoy were mailed from nodeMailer. Have a great day! :)";
// const options = {
//   from: process.env.EMAIL,
//   to: "naveenchinna383@gmail.com",
//   subject: "Test Email from NodeMailer",
//   text: message,
//   html: HTML_TEMPLATE(message),
// };

// sendMail(options, (info) => {
//   console.log("Email Sent! successfully!");
//   console.log(info, info.messageId);
// });

async function emailBuilder(to, subject, text) {
  try {
    const options = {
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      text: text,
      html: HTML_TEMPLATE(text),
    };
    sendMail(options, (info) => {
      console.log("Email Sent! successfully!");
      console.log(info, info.messageId);
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  sendMail,
  HTML_TEMPLATE,
  emailBuilder,
};
