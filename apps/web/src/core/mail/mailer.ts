import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    from:process.env.SMTP_FROM,
    
    port: 587,
    // secure: true, // use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SENDGRID_API,
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