import { EventEmitter } from "events";
import { CommandType } from "~/cmd";
import { IrcTags } from ".";

const toStringMap = new Map<CommandType, string>([
    [CommandType.VimCommand, "VimCommand"],
    [CommandType.VimAfter, "VimAfter"],
    [CommandType.VimInsert, "VimInsert"],
]);

export type MessageForVim = {
    type: CommandType
    displayName: string,
    time: Date,
}

export function toStringMessageForvim(message: MessageForVim): string {
    return toStringMap.get(message.type);
}

const msgToEmit: {[key: string]: CommandType} = {
    "!vc": CommandType.VimCommand,
    "!va": CommandType.VimAfter,
    "!vi": CommandType.VimInsert,
}

function time() {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}`;
}

//@ts-ignore
export default function VimCommands(emitter: EventEmitter, tags: IrcTags, message: string): void {
    const type = msgToEmit[message];

    if (type) {
        emitter.emit("vim-with-me", {
            type, displayName: tags["display-name"], time: time(),
        });
    }
}
