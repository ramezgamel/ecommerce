const nodemailer = require("nodemailer");
module.exports = class Email {
  constructor(user) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    // this.url = url;
    this.from = `MHP <${process.env.SEND_MAIL}`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  };

  async send (subject, message) {
    const mailOption = {
      from: this.from,
      to: this.to,
      subject: subject,
      text: message,
    };
    await this.newTransport().sendMail(mailOption)
  };

  async sendWelcome(){
    await this.send("Welcome to Our MHP Store.", `Hi, ${this.firstName}. \n Congratulations! your registration has been done successfully. \n best regards MHP.`)
  }

  async sendPasswordReset(url){
    const message = `Forgot your password? Submit a PATCH request with your new password and password confirm to: ${url}.\n if you didn't forget your password, please ignore this message.`;
    await this.send("Your password reset token valid for 5min.", message);
  }

};
