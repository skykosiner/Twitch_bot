import { Readable } from "stream";
import fs from "fs";

export function logChat(name: string, message: string): boolean {
    if (name === 'yonikosiner' || name === "nightbot" || name === "StreamElements") return false;

    if (message.length >= 70) return false;

    const msg: string = `${name}: ${message}`;

    const readable = Readable.from([`${msg}\n`]);
    const writeStream = fs.createWriteStream('/home/yoni/chat.txt');

    readable.on("data", (chunk: any) => {
        writeStream.write(chunk);
    });

    return true;
};
