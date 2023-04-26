import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // tls: {
    //   // do not fail on invalid certs
    //   rejectUnauthorized: false,
    // },
  });

export default transport;

// transport.verify(function (error, success) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Mail Server is ready to take our messages");
//     }
//   });