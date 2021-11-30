import { EventEmitter } from "events";
import { CommandType, SystemCommand } from "../cmd";
import { IrcTags } from ".";

const toStringMap = new Map<CommandType, string>([
    [CommandType.SystemCommand, "asdf"],
    [CommandType.SystemCommand, "display off"],
    [CommandType.SystemCommand, "change background"],
    [CommandType.SystemCommand, "i3 workspace"],
]);

export function toStringMessageForSys(message: SystemCommand): string {
    return toStringMap.get(message.commandType);
}

const msgToEmit: {[key: string]: CommandType} = {
    "asdf": CommandType.SystemCommand,
    "!turn off screen": CommandType.SystemCommand,
    "!change background": CommandType.SystemCommand,
    "!i3 workspace": CommandType.SystemCommand,
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
