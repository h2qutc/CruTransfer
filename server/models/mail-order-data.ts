import { IOrder } from "./order";

export class MailOrderData {

    sender: string = '';
    recipients: string[] = [];
    recipientsHtml?: string = '';
    detail: string = '';
    message: string = '';
    fileName: string = '';
    fileSize: number = 0;
    expiredDate: string = '';
    createdDate: string = '';
    link: string = '';

    constructor(order: IOrder) {

        this.sender = order.sender;
        this.recipients = order?.recipients;
        this.recipientsHtml = this.factoryRecipientsHtml(this.recipients);
        this.message = order.message;
        this.fileName = order.fileInfos.name;
        this.fileSize = order.fileInfos.humanSize;
        this.createdDate = order.createdDate.toLocaleDateString();
        this.expiredDate = order.expiredDate.toLocaleDateString();

        const nbItem = 1;
        this.detail = `${nbItem} item, ${this.fileSize} in total - Expires on ${this.expiredDate}`;

        this.link = order.link;

    }


    private factoryRecipientsHtml(recipients: string[]): string {
        return recipients.join(', ');
    }
}