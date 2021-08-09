import * as nodemailer from 'nodemailer';
import { EmailConfig, SMTP_CONFIG } from '../config';
var inlineCss = require('inline-css');
var fs = require('fs');
var hogan = require('hogan.js');


export class EmailService {
  private _transporter!: nodemailer.Transporter;

  private _templateHtmlRecipients: any;
  private _templateHtmlSender: any;
  private _templateHtmlSenderOnceDownloaded: any;
  private _templateHtmlForgotPassword: any;
  private _templateHtmlActivateAccount: any;
  private _templateHtmlVerifySender: any;

  private static instance: EmailService;

  private constructor() {

    this._templateHtmlRecipients = fs.readFileSync("services/template/templateEmailRecipients.html");
    this._templateHtmlSender = fs.readFileSync("services/template/templateEmailSender.html");
    this._templateHtmlSenderOnceDownloaded = fs.readFileSync("services/template/templateEmailSenderOnceDownloaded.html");
    this._templateHtmlForgotPassword = fs.readFileSync("services/template/templateEmailForgotPassword.html");
    this._templateHtmlActivateAccount = fs.readFileSync("services/template/templateEmailActivateAccount.html");
    this._templateHtmlVerifySender = fs.readFileSync("services/template/templateEmailVerifySender.html");

    this._transporter = nodemailer.createTransport(SMTP_CONFIG);
  }

  public static getInstance(): EmailService {
    if(!EmailService.instance){
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public sendEmailToRecipients(subject: string, data: any): Promise<any>{
    return this.sendMail(subject, data, this._templateHtmlRecipients);
  }

  public sendEmailActivateAccount(subject: string, data: any): Promise<any>{
    return this.sendMail(subject, data, this._templateHtmlActivateAccount);
  }

  public sendEmailVerifySender(subject: string, data: any): Promise<any>{
    return this.sendMail(subject, data, this._templateHtmlVerifySender);
  }

  public sendEmailForgotPassword(subject: string, data: any): Promise<any>{
    return this.sendMail(subject, data, this._templateHtmlForgotPassword);
  }

  public sendEmailToSender(subject: string, data: any): Promise<any>{
    return this.sendMail(subject, data, this._templateHtmlSender);
  }

  public sendEmailToSenderOnceDownloaded(subject: string, data: any): Promise<any>{
    return this.sendMail(subject, data, this._templateHtmlSenderOnceDownloaded);
  }


  private async sendMail(subject: string, data: any, templateHtml: any ): Promise<any> {

    const templateStyled = await inlineCss(templateHtml.toString(), { url: "file://" + __dirname + "/template/" });

    const templateCompiled = hogan.compile(templateStyled);
    const templateRendered = templateCompiled.render(data);

    const options = {
      from: EmailConfig.from,
      to: data.recipients,
      subject: subject,
      html: templateRendered
    }

    return this._transporter.sendMail(options);

  }
}