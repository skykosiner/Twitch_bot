import { EventEmitter } from "events";
import { CommandType, SystemCommand } from "../cmd";
import { IrcTags } from ".";

const toStringMap = new Map<CommandType, string>([
    [CommandType.asdf, "asdf"],
    [CommandType.xrandr, "display off"],
]);

export function toStringMessageForSys(message: SystemCommand): string {
    return toStringMap.get(message.commandType);
}

const msgToEmit: {[key: string]: CommandType} = {
    "asdf": CommandType.asdf,
    "!turn off screen": CommandType.xrandr,
}

//@ts-ignore
export default function SysCommands(emitter: EventEmitter, tags: IrcTags, message: string): void {
    const type = msgToEmit[message];

    const sys: SystemCommand = {
        username: tags["display-name"],
        message: message,
        commandType: type,
    }

    if (type) {
        emitter.emit("start-sys", sys);
    }
}
