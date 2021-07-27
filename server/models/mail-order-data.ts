import { IOrder } from "./order";

export class MailOrderData {
    sender: string = '';
    recipients: string[] = [];
    recipientsHtml?: string = '';
    detail: string = '';
    message: string = '';
    fileName: string = '';
    fileSize: number = 0;
    fileExpiredTime: string = '';
    link: string = '';

    constructor(order: IOrder) {

        const nbItem = 1;
        const detail = `${nbItem} item, ${order.fileInfos.size} in total`;
        const expiredTime = 'expired time';

        this.sender = order.sender;
        this.recipients = order?.recipients;
        this.recipientsHtml = this.factoryRecipientsHtml(this.recipients);
        this.detail = detail;
        this.message = order.message;
        this.fileName = order.fileInfos.name;
        this.fileSize = order.fileInfos.size;
        this.fileExpiredTime = expiredTime;
        this.link = 'http://localhost:4204/download';

    }


    private factoryRecipientsHtml(recipients: string[]): string {
        return recipients.join(', ');
    }
}