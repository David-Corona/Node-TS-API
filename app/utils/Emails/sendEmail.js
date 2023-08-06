const nodemailer = require("nodemailer");
const handlebars = require("handlebars");

const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {

  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      service: process.env.MAIL_SERVICE,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_APP_PASS, 
      },
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = {
        from: process.env.MAIL_USER,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),

    };

    // Send email
    transporter.sendMail(options, (error, info) => {
      if (error) {
        console.log(error);
        return error;
      } else {
        console.log('Email enviado: ' + info.response);
        return res.status(200).json({
          success: true,
        });
      }
    });
  } catch (error) {
    return error;
  }
};

module.exports = sendEmail;