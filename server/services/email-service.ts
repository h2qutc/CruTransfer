import * as nodemailer from 'nodemailer';


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


  sendMail(to: string, subject: string, content: string) {

    const options = {
      from: 'noreply@cru-transfer.com',
      to: to,
      subject: subject,
      text: content
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