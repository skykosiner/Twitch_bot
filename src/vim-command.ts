import { IrcTags } from "./irc";
import bus from "./message-bus";

export default function vimCommand(tags: IrcTags, message: string): void | boolean {
    if (message.startsWith("!va")) return bus.emit("vim", { username: tags["display-name"], message });
    if (message.startsWith("!vi")) return bus.emit("vim", { username: tags["display-name"], message });
    if (message.startsWith("!vc")) return bus.emit("vim", { username: tags["display-name"], message });
}
