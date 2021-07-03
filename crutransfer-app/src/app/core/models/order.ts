import { IFileInfo } from "./file-info";

export interface IOrder {
    sender: string;
    recipients: string[];
    fileInfos: IFileInfo;
    option: number;
    password: string;
    message: string;
    created: Date;
}
