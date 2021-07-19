import * as nodemailer from 'nodemailer';


export class EmailService {
  private _transporter!: nodemailer.Transporter;


  constructor() {
    // this._transporter = nodemailer.createTransport(
    //   `smtps://<username>%40gmail.com:<password>@smtp.gmail.com`
    // );

    this._transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'h2qbkhn@gmail.com',
        pass: 'i7huTUGA'
      }
    });

  }

  sendMail(to: string, subject: string, content: string) {
    const options = {
      from: 'h2qbkhn@gmail.com',
      to: to,
      subject: subject,
      text: content
    }

    this._transporter.sendMail(
      options, (error, info) => {
        if (error) {
          return console.log(`error: ${error}`);
        }
        console.log(`Message Sent ${info.response}`);
      });
  }
}