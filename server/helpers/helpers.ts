export function runAsyncWrapper(callback: Function) {
    return function (req: any, res: any, next: any) {
        callback(req, res, next)
            .catch(next)
    }
}

export const sendError = (res: any, code: number = 500, message?: any) => {
    res.status(code).send({
        message: message
    })
}


export const sendOk = (res: any, payload: any, message?: any) => {
    res.status(200).json({
        message: message,
        payload: payload
    })
}

export const addDays = (date: Date, days: number): Date => {
    let result = new Date();
    result.setDate(date.getDate() + days);
    return result;
}

export const generateOTP = (nb: number = 4): string => {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < nb; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}