import { config } from 'dotenv';
import nodemailer from 'nodemailer';
import { Service } from 'typedi';
import { CartPurchase } from '../../cart/service/interface';
import Logger from '../../utils/logger/logger';
import { generateEmailContent } from '../helpers';
import { transporter, user } from '../options';

config();
@Service()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = transporter;
  }

  async sendPurchaseConfirmationEmail(purchaseDetails: CartPurchase) {
    const mailOptions = {
      from: user,
      to: `${purchaseDetails.email}`,
      subject: 'Purchase Confirmation',
      text: `Thank you for your purchase! Total Cost: ${purchaseDetails.totalCost}`,
      html: generateEmailContent(purchaseDetails),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      Logger.info('Email sent to: %s', `${purchaseDetails.email}`);
    } catch ({ message }) {
      Logger.error('Error sending email:', message);
    }
  }
}
