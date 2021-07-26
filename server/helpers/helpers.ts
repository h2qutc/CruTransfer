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