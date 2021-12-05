import { EventEmitter } from "events";
import { IrcTags } from ".";

export enum YoniMessage {
    TurnOn = 1,
    TurnOff = 2,
}

const toStringMap = new Map<YoniMessage, string>([
    [YoniMessage.TurnOn, "Turning on"],
    [YoniMessage.TurnOff, "Turning off"]
]);

export type MessageFromYoni = {
    type: YoniMessage,
    displayName: string,
}

export function toStringMessageFromYoni(message: MessageFromYoni): string {
    return toStringMap.get(message.type);
}

const msgToEmit: {[key: string]: YoniMessage} = {
    "!enable": YoniMessage.TurnOn,
    "!disable": YoniMessage.TurnOff,
}

//@ts-ignore
export default function Commands(emitter: EventEmitter, tags: IrcTags, message: string): void {
    const type = msgToEmit[message];

    if (type) {
        emitter.emit("from-yoni", {
            type, displayName: tags["display-name"]
        });
    }
}
