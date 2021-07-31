import { SendActions } from "../enums";
import { IFileInfo } from "./file-info";

export interface IOrder {
    _id: string;
    sender: string;
    recipients: string[];
    fileInfos: IFileInfo;
    action: SendActions;
    password: string;
    message: string;
    createdDate: Date;
    expiredDate?: Date;
    link: string;

    status: string;
    totalDownloads: number;
}
