import { Readable } from "stream";
import { createWriteStream } from "fs";
import { VimCommand, vimCommand } from "./irc/yoni-commands";

export default function logVim(command: vimCommand): boolean {
    if (command.type === VimCommand.VimAfter) {
        const readable = Readable.from([`hello world\n`]);
        const writeStream = createWriteStream('/home/yoni/command.txt');

        readable.on("data", (chunk: any) => {
            writeStream.write(chunk);
        });
    };

    if (command.type === VimCommand.VimInsert) {
        const readable = Readable.from([`hello world insert\n`]);
        const writeStream = createWriteStream('/home/yoni/command.txt');

        readable.on("data", (chunk: any) => {
            writeStream.write(chunk);
        });
    };

    return true;
};
