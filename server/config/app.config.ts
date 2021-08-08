export const BaseUrlFront = 'https://crutransfer.me';

export const AuthConfig = {
    secret: "crutransfer-secret-key"
}

export const EmailConfig = {
    from: {
        name: 'CruTransfer',
        address: 'noreply@crutransfer.me'
    }
}

// export const SMTP_CONFIG = {
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'cielo.stark99@ethereal.email',
//         pass: 'ythCxGTyShYRpH8qtQ'
//     }
// }

export const SMTP_CONFIG = {
    host: 'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'noreply@crutransfer.me',
        pass: 'crutransfer2021'
    }
}

export const DAYS_BEFORE_EXPIRED = 8;