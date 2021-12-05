import { appendFile, readFile } from "fs";
import Command, { CommandType } from "./cmd";
import bus from "./message-bus";
import TCPSocket from "./tcp";

export default class Band {
    public banded: string[] = []

    constructor(private tcp: TCPSocket) {
    }

    public async addBand(username: string): Promise<boolean | void> {
        await this.getBandFile();
        if(this.banded.includes(username)) return bus.emit("irc-message", `The user @${username} is allready band`);

        this.banded.push(username);

        this.tcp.write(new Command().reset()
                  .setStatusLine(`${username} has been banded`)
                  .setType(CommandType.StatusUpdate).buffer
                 );

        appendFile("./band-users.txt", `${username}\n`, function(err) {
            if (err) throw err;
            return;
       })
    };

    public async isUserBand(username: string): Promise<boolean> {
        await this.getBandFile();
        return this.banded.includes(username);
    }

    public getBandFile() {
        return new Promise((res, rej) => {
            readFile("./band-users.txt", (err: Error | undefined, data: Buffer) => {
                if (err) {
                    console.log(err);
                    rej(err);
                } else {
                    const arr = data.toString().split("\n")
                    for (const a in arr) {
                        if (arr[a] !== "") this.banded.push(arr[a]);
                    };
                    res(null);
                }
            });
        });
    }
};
