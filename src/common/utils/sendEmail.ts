import nodemailer from "nodemailer";

const sendEmail = async (options: any) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: Number(process.env.EMAIL_PORT) || 2525,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Zeyad Hesham <zik@kitch.com>",
    to: options.to,
    subject: options.subject,
    text: options.text,
  };
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
