import { SendActions } from "../enums";
import { IFileInfo } from "./file-info";

export interface IOrder {
    sender: string;
    recipients: string[];
    fileInfos: IFileInfo;
    action: SendActions;
    password: string;
    message: string;
    created: Date;
}
