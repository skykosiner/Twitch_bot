import getType from "../get-type";
import { SystemCommand } from "../systemCommands";
import { CommandType } from "../cmd";
import { ValidationResult } from "~/validation";

type TieredCommand = {
    name: string | ((input: string) => boolean),
    getValue: (input: string) => string;
}

function getCommand(input: string, commands: TieredCommand[]) {
    let out: string | null = null;
    for (let i = 0; !out && i < commands.length; ++i) {
        const c = commands[i];
        if (typeof c.name === "string" && c.name === input ||
            typeof c.name === "function" && c.name(input)) {
            out = commands[i].getValue(input);
        }
    }

    return out;
}

const commands = [
    "h",
    "j",
    "k",
    "l",
    "o",
    "O",
    "~",
    "gg",
    "G",
    "zz",
    "zh",
    "zl",
    "zb",
    "H",
    "L",
    "0",
    "$",
    "_",
    "<<",
    ">>",
    "V",
    "v",
    "A",
    "I",
];

const NamedCommands: TieredCommand[] = [{
    name: "random",
    getValue() {
        return commands[Math.floor(Math.random() * commands.length)];
    }
}, {
    name: "C-a",
    getValue() {
        return "a";
    }
}, {
    name: "C-d",
    getValue() {
        return "d";
    }
}, {
    name: "C-u",
    getValue() {
        return "u";
    }
}, {
    name(input: string) {
        return commands.includes(input[input.length - 1]) &&
            !isNaN(+input.substring(0, input.length - 1));
    },
    getValue(input: string) {
        return input;
    }
}];

function hasBadCharacters(str: string): boolean {
    return Boolean(str.split("").
        map(x => x.charCodeAt(0)).
        filter(x => x < 32 || x > 127).length);
}

function convertEscapeCharacters(str: string): string {
    return str.split("\\n").join("\r").split("\\r").join("\r");
}

function insert(data: SystemCommand): string {
    if (hasBadCharacters(data.message)) {
        return "You cannot use 32 < ascii > 127";
    }

    data.message= convertEscapeCharacters(data.message);

    if (data.message.length > 5) {
        data.message= data.message.substr(0, 5);
    }

    return "";
};

function vimCommand(data: SystemCommand): string {
    const input = data.message;

    if (commands.includes(input)) {
        return "";
    }
    const cmd = getCommand(input, NamedCommands);
    if (cmd) {
        data.message = cmd;
        return "";
    }

    return `You cannot use ${data.message} as it is not a valid command`;
}

export default function validateVimCommand(data: SystemCommand): ValidationResult {
    const type = getType(data);

    let error: string = "";
    switch (type) {
    case CommandType.VimCommand:
        error = vimCommand(data);
        break;
    case CommandType.VimInsert:
    case CommandType.VimAfter:
        error = insert(data);
        break;
    }

    if (error === "") {
       return {
            success: true
        };
    }

    return {
        success: false,
        error,
    };
}
