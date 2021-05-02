import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";

import { ValidationError, error } from "../../../utils/error/error.js";

export const sendSignUp = (email, username, url, token) => {
  const template = "/views/mail/signUp.handlebars";
  const subject = "Bienvenido!";
  const data = { username, url, token };

  createMailOptions(template, email, subject, data);
};

export const sendRequestResetPassword = (email, username, url, token) => {
  const template = "/views/mail/requestResetPassword.handlebars";
  const subject = "Solicitud para restablecer la contraseña!";
  const data = { username, url, token };

  createMailOptions(template, email, subject, data);
};

export const sendConfirm = (email, username) => {
  const template = "/views/mail/confirm.handlebars";
  const subject = "Cuenta confirmada!";
  const data = { username };

  createMailOptions(template, email, subject, data);
};

export const sendResetPassword = (email, username) => {
  const template = "/views/mail/resetPassword.handlebars";
  const subject = "Contraseña modificada.";
  const data = { username };

  createMailOptions(template, email, subject, data);
};

const createMailOptions = (template, email, subject, data) => {
  const source = fs.readFileSync(path.join(path.resolve(), template), "utf8");
  const compiledTemplate = handlebars.compile(source);

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: subject,
    html: compiledTemplate(data),
  };

  sendMail(mailOptions);
};

const sendMail = (mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, function (e, info) {
    if (e) {
      throw new ValidationError(error.mail, "Error al enviar el correo.");
    }
  });
};
