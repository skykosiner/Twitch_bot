import { EventEmitter } from "events";
import { IrcTags } from ".";

export enum YoniMessage {
    TurnOn = 1,
    TurnOff = 2,
    ASDF = 3,
    i3Workspace = 4,
    changeBackground = 5,
    displayOff = 6,
}

const toStringMap = new Map<YoniMessage, string>([
    [YoniMessage.TurnOn, "TurnOn"],
    [YoniMessage.TurnOff, "TurnOff"],
    [YoniMessage.ASDF, "asdf"],
    [YoniMessage.i3Workspace, "i3 workspace"],
    [YoniMessage.changeBackground, "change background"],
    [YoniMessage.displayOff, "display off"],
]);

export type MessageFromYoni = {
    type: YoniMessage,
    displayName: string,
    time: Date,
}

export function toStringMessageFromYoni(message: MessageFromYoni): string {
    return toStringMap.get(message.type);
}

const msgToEmit: {[key: string]: YoniMessage} = {
    "!turn-on": YoniMessage.TurnOn,
    "!trun-off": YoniMessage.TurnOff,
    "asdf": YoniMessage.ASDF,
    "!i3 workspace": YoniMessage.i3Workspace,
    "!change background": YoniMessage.changeBackground,
    "!turn off screen": YoniMessage.displayOff,
}

function time() {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}`;
}

//@ts-ignore
export default function Commands(emitter: EventEmitter, tags: IrcTags, message: string): void {
    const type = msgToEmit[message];

    if (type) {
        emitter.emit("from-yoni", {
            type, displayName: tags["display-name"], time: time(),
        });
    }
}
