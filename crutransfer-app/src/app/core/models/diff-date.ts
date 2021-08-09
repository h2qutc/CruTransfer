import { OrderStatus } from "./status.enum";

const WARNING_LIMIT = 5;
const DANGER_LIMIT = 2;

export class DiffDate {
    days: number;
    hours: number;
    minutes: number;

    status?: OrderStatus = OrderStatus.Info;

    constructor(opt: any) {
        this.days = opt.days;
        this.hours = opt.hours;
        this.minutes = opt.minutes;

        this.updateStatus();

    }

    public toString(): string {
        if (this.days > 0) {
            return `${this.days} days`;
        }
        if (this.hours > 0) {
            return `${this.hours} hours`;
        }
        if (this.minutes > 0) {
            return `${this.minutes} minutes`;
        }
        return null;
    }

    private updateStatus() {
        if (this.days > WARNING_LIMIT) {
            this.status = OrderStatus.Info;
        } else if (this.days > DANGER_LIMIT) {
            this.status = OrderStatus.Warning;
        } else {
            this.status = OrderStatus.Danger;
        }
    }
}