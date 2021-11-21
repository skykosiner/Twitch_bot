import { CommandType, SystemCommand } from "./cmd";

export default function getType(data: SystemCommand): CommandType {
    if (data.commandType === CommandType.VimCommand) return CommandType.VimCommand;
    if (data.commandType === CommandType.VimInsert) return CommandType.VimInsert;
    if (data.commandType === CommandType.VimAfter) return CommandType.VimAfter;
    if (data.commandType === CommandType.SystemCommand) return CommandType.SystemCommand;
    if (data.commandType === CommandType.asdf) return CommandType.asdf;
    if (data.commandType === CommandType.xrandr) return CommandType.xrandr;

    return CommandType.SystemCommand;
};
