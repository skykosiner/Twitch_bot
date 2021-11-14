import { EventEmitter } from "events";
import { IrcTags } from ".";

export enum YoniMessage {
    StartYourEngines = 1,
    PumpTheBreaks = 2,
}

const toStringMap = new Map<YoniMessage, string>([
    [YoniMessage.StartYourEngines, "StartYourEngines"],
    [YoniMessage.PumpTheBreaks, "PumpTheBreaks"],
]);

export type MessageFromYoni = {
    type: YoniMessage,
}

export function toStringMessageFromYoni(message: MessageFromYoni): string {
    return toStringMap.get(message.type);
}

const msgToEmit: {[key: string]: YoniMessage} = {
    "!start-program-with-me": YoniMessage.StartYourEngines,
    "!stop-program-with-me": YoniMessage.PumpTheBreaks,
}


export default function Commands(emitter: EventEmitter, tags: IrcTags, message: string): void {
    if (tags["display-name"] === "yonikosiner") {

        const type = msgToEmit[message];
        if (type) {
            emitter.emit("from-yoni", {
                type,
            });
        }
    }
}

