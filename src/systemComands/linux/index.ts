import { EventEmitter } from 'events';
import dateNow from "../../utils/dateNow";

export class SystemCommands extends EventEmitter {
    private stopTime: number;

    constructor(private onCommand: string, private offCommand: string,
        private commandLength: number) {
            this.stopTime = 0;
    }

};

