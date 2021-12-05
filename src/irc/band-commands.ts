import { IrcTags } from ".";
import bus from "../message-bus";

export enum Ban {
    ban = 1,
    unband = 2,
}

const mods: string[] = ["yonikosiner", "nniklask"];

export default function bandCommands(message: string, tags: IrcTags): void | boolean {
    if (message.startsWith("!band")) {
        if (!mods.includes(tags["display-name"])) return bus.emit("irc-message", "Only Yoni and mods can banded users");
        bus.emit("band", { message: message, type: Ban.ban });
        return;
    }

    if (message.startsWith("!unband")){
        if (!mods.includes(tags["display-name"])) return bus.emit("irc-message", "Only Yoni and mods can unbanned users");
        bus.emit("band", { message: message, type: Ban.unband });
        return;
    }
};

/*
1A4
1 * 256 = 256
A = 10
10 * 16 = 160
4 * 1  = 4
256 + 160 + 4 = 420
*/
