import * as nodemailer from 'nodemailer';
var inlineCss = require('inline-css');
var fs = require('fs');
var hogan = require('hogan.js');


export class EmailService {
  private _transporter!: nodemailer.Transporter;


  constructor() {

    const config = {
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'cielo.stark99@ethereal.email',
        pass: 'ythCxGTyShYRpH8qtQ'
      }
    };

    this._transporter = nodemailer.createTransport(config);

  }


  async sendMail(to: string, subject: string, content: string) {

    //Load the template file
    const templateFile = fs.readFileSync("services/template/templateEmail.html");
    //Load and inline the style
    const templateStyled = await inlineCss(templateFile.toString(), { url: "file://" + __dirname + "/template/" });
    //Inject the data in the template and compile the html
    const templateCompiled = hogan.compile(templateStyled);
    const templateRendered = templateCompiled.render({ text: "HelloWorld" });


    const options = {
      from: 'noreply@cru-transfer.com',
      to: to,
      subject: subject,
      text: content,
      html: templateRendered
    }

    this._transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log('Error occurred. ' + err.message);
        return process.exit(1);
      }

      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });




  }
}