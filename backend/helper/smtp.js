const nodemailer = require("nodemailer");
const fs = require('fs');
let path = require("path");
async function main(to, subject, text, html) {
  let data = fs.readFileSync(path.join(__dirname, './smtpConfig.json'));
  data = JSON.parse(data);
  let transporter = nodemailer.createTransport({
    host: data.host,
    port: data.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: data.user, // generated ethereal user
      pass: data.pass, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: data.from,
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  });
  console.log("Message sent: %s", info.response);
}

main().catch(console.error);