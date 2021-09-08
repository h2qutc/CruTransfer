export const BaseUrlFront = "https://crutransfer.me";

export const AuthConfig = {
  secret: process.env.SECRET_KEY || "demo-secret-key",
};

export const EmailConfig = {
  from: {
    name: "CruTransfer",
    address: "noreply@crutransfer.me",
  },
};

export const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_HOST ? true : false,
  auth: {
    user: process.env.SMTP_USER || "cielo.stark99@ethereal.email",
    pass: process.env.SMTP_PASSWORD || "ythCxGTyShYRpH8qtQ",
  },
};

export const DAYS_BEFORE_EXPIRED = 8;

// 5 Mo
export const LIMIT_SIZE_BLOCK = 1024 * 1024 * 5;

export const FOLD_UPLOADS = "Uploads";
