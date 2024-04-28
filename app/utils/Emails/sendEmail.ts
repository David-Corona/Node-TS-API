import nodemailer, { TransportOptions } from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";

const sendEmail = async (email: string, subject: string, payload: any, template: string) => {

  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || '',
      service: process.env.MAIL_SERVICE || '',
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_APP_PASS, 
      },
    } as TransportOptions);

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = {
        from: process.env.MAIL_USER,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),

    };

    // Send email
    await transporter.sendMail(options)

  } catch (error) {
    console.log('Error al enviar email: ' + error);
    return error;
  }
};


export default sendEmail;