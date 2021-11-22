import bus from "../message-bus";
import dateNow from "../date";
import { SystemCommand as sys } from "cmd";

export default class SystemCommand {
    private stopTime: number;
    private timerId: ReturnType<typeof setInterval>;

    constructor(private onCommand: string, private offCommand: string | null,
                private commandLength: number | null) {
        this.stopTime = 0;
    }

    add(message: sys): boolean | void {
        if (this.offCommand === null) {
            return bus.emit("system-command", this.onCommand, message);
        }
        const now = dateNow();
        if (now > this.stopTime) {
            bus.emit("system-command", this.onCommand, message);
            this.startTimer(message);
            this.stopTime = now;
        }

        this.stopTime += this.commandLength;
    }

    private startTimer(message: sys) {
        if (this.timerId) {
            return;
        }

        this.timerId = setInterval(() => {
            const now = dateNow();
            if (now > this.stopTime) {
                clearInterval(this.timerId);
                this.timerId = null;
                bus.emit("system-command", this.offCommand, message);
            }
        }, 25);
    }
}
