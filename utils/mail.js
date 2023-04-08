const nodemailer = require("nodemailer");

sendEmail = async (options) => {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    
  });

  // send mail with defined transport object
  const mailOption = {
    from: "Ramez <foo@example.com>",
    to: options.mail,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOption);
};

module.exports = sendEmail;
