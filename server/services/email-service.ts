import * as nodemailer from 'nodemailer';
import { EmailConfig } from '../config';
var inlineCss = require('inline-css');
var fs = require('fs');
var hogan = require('hogan.js');


export class EmailService {
  private _transporter!: nodemailer.Transporter;

  private _templateFile: any;


  constructor() {

    this._templateFile = fs.readFileSync("services/template/templateEmail.html");

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


  async sendMail(to: string, data: any ) {

    const subject = `${data.sender} sent you some files via CruTransfer`;

    const templateStyled = await inlineCss(this._templateFile.toString(), { url: "file://" + __dirname + "/template/" });

    const templateCompiled = hogan.compile(templateStyled);
    const templateRendered = templateCompiled.render(data);


    const options = {
      from: EmailConfig.from,
      to: to,
      subject: subject,
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