import { CommandType, SystemCommand } from "./cmd";
import getType from "./get-type";

export default function statusLine(data: SystemCommand, validInput: boolean = true): string {

    const name = data.username;
    if (!validInput) {
        return `Hey, you are wrong ${name}`;
    }

    const type = getType(data);

    if (type === CommandType.VimInsert || type === CommandType.VimAfter) {
        return `${name}: Has inserted ${data.message }`;
    }

    if (type === CommandType.VimCommand) {
        return `${name}: Vim Command ${data.message }`;
    }

    if (type === CommandType.SystemCommand) {
        return `${name}: ${data.message }`;
    }

    return `${name}: ${data.commandType} with ${data.message}`;
};
