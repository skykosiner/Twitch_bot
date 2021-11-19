import { SystemCommand } from "./systemCommands";
import { CommandType } from "./cmd";
import getType from "./get-type";

export default function getData(data: SystemCommand): null | Buffer {
    const type = getType(data);
    let out: Buffer | null = null;

    switch (type) {
        case CommandType.VimAfter:
            case CommandType.VimInsert:
            out = Buffer.from(`norm ${type === CommandType.VimAfter ? "a" : "i"}${data.message}`);
        break;

        case CommandType.VimCommand:
            out = Buffer.from(`norm ${data.message}`);
        break;

        case CommandType.SystemCommand:
            out = Buffer.from(`silent! !${data.message}`);
        break;
    }
    return out;
}
