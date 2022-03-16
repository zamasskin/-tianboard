import { Inject, Injectable } from "@tsed/di";
import nodemailer, { SendMailOptions } from "nodemailer";
import { ConfigService } from "./ConfigService";

@Injectable()
export class MailService {
  @Inject()
  configService: ConfigService;

  async createTransporter() {
    const transport = this.configService.loadConfigMail();
    console.log(transport);
    if (transport) {
      return nodemailer.createTransport(transport);
    }

    let testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  }

  async send(options: SendMailOptions) {
    const transporter = await this.createTransporter();
    return transporter.sendMail(options);
  }
}
