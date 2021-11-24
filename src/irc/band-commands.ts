import { IrcTags } from ".";
import bus from "../message-bus";

export enum Ban {
    ban = 1,
    unband = 2,
}

export default function bandCommands(message: string, tags: IrcTags): void | boolean {
    if (message.startsWith("!band")) {
        if (tags["display-name"] !== "yonikosiner") return bus.emit("irc-message", "Only yoni can band users");
        bus.emit("band", { message: message, type: Ban.ban });
        return;
    }

    if (message.startsWith("!unband")) {
        if (tags["display-name"] !== "yonikosiner") return bus.emit("irc-message", "Only yoni can unband users");
        bus.emit("band", { message: message, type: Ban.unband });
        return;
    }
};
