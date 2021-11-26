import { IrcTags } from ".";
import bus from "../message-bus";

export enum Ban {
    ban = 1,
    unband = 2,
}

const mods: string[] = ["yonikosiner", "nniklask"];

export default function bandCommands(message: string, tags: IrcTags): void | boolean {
    if (message.startsWith("!band")) {
        if (!mods.includes(tags["display-name"])) return bus.emit("irc-message", "Only yoni and mods can band users");
        bus.emit("band", { message: message, type: Ban.ban });
        return;
    }

    if (message.startsWith("!unband")) {
        if (tags["display-name"] !== "yonikosiner") return bus.emit("irc-message", "Only yoni can unband users");
        bus.emit("band", { message: message, type: Ban.unband });
        return;
    }
};
