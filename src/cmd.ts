const bufferLength = 1 + 50 + 2 + 200;
const zeroBuf = Buffer.alloc(bufferLength).fill(0);

//            1             2..
//     +---------------+--------------+
//     |     type      |     data     |
//     +---------------+--------------+

export type SystemCommand = {
    username: string,
    message: string,
    commandType: CommandType,
};

export enum CommandType {
    VimCommand = 1,
    SystemCommand = 2,
    VimInsert = 3,
    VimAfter = 4,
    xrandr = 5,
    asdf = 6,
}

const typeToString: Map<CommandType, string> = new Map([
    [CommandType.VimCommand, "VimCommand"],
    [CommandType.VimInsert, "VimInsert"],
    [CommandType.VimAfter, "VimAfter"],
    [CommandType.SystemCommand, "SystemCommand"],
]);

export function commandToString(type: CommandType): string {
    return typeToString.get(type);
}

const typeIdx = 0;
const dataIdx = 53;

export default class Command {
    private _buffer: Buffer;
    get buffer(): Buffer {
        return this._buffer;
    }

    constructor() {
        this._buffer = Buffer.allocUnsafe(bufferLength);
    }

    reset(): Command {
        zeroBuf.copy(this._buffer);
        return this;
    }

    setType(type: CommandType): Command {
        this._buffer[typeIdx] = type;
        return this;
    }

    setData(data: Buffer | null): Command {
        if (data === null) {
            return this;
        }

        if (data.length > 200) {
            throw new Error("Data is over 200");
        }
        data.copy(this._buffer, dataIdx);
        return this;
    }
}
