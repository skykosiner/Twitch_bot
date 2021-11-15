import { Readable } from "stream";
import { createWriteStream } from "fs";

/**
    @param {string} message
    @return Take the message and turn it into a array then check the [0] which is
    the username if it is not a bot or me (yoni) then log the message with the
    original thing passed in to chat.txt
*/

export default function logChat(message: string): boolean {
    if (message.length >= 70) return false;
    let msg: string[] = message.split(" ");

    if (msg[0] === "streamelemetns:" || msg[0] === "nightbot:" || msg[0] === "yonikosiner:") return false;

    const readable = Readable.from([`${message}\n`]);
    const writeStream = createWriteStream('/home/yoni/chat.txt');

    readable.on("data", (chunk: any) => {
        writeStream.write(chunk);
    });

    return true;
};
