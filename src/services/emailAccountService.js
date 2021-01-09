const sgMail = require("@sendgrid/mail");

// set send grid api key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailAccountService {
  constructor() {}

  async sendEmail(email) {
    try {
      await sgMail.send(email);
    } catch (error) {
      console.log("error sending email", error.message);
    }
  }

  async sendWelcomeEmail(user) {
    const welcomeEmail = {
      to: user.email,
      from: "delacruztony.adc@gmail.com",
      subject: `Welcome ${user.name}`,
      text: "Welcome to my NodeJS app!",
      html: "<h1>Updates coming soon!</h1>",
    };
    await this.sendEmail(welcomeEmail);
  }

  async sendCancellationEmail(user) {
    const cancellationEmail = {
      to: user.email,
      from: "delacruztony.adc@gmail.com",
      subject: `See you again, ${user.name}!`,
      text:
        "We would like to receive some feedback from you to help my app to be better!",
      html: "<h1>Updates coming soon!</h1>",
    };
    await this.sendEmail(cancellationEmail);
  }
}

module.exports = new EmailAccountService();
