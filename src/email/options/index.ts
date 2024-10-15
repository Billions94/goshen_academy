import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

const { EMAIL: user, PASSWORD: pass } = process.env;
export const transporter: nodemailer.Transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user,
    pass,
  },
});

export { user };
