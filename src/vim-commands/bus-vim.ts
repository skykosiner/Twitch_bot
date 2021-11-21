import Command, { SystemCommand } from "../cmd";
import getData from "../get-data";
import getType from "../get-type";
import TCPSocket from "../tcp";
import validate from "../validation";
import bus from "../message-bus";

interface VimMessage {
    username: string,
    message: string,
}

export default function vimBus(tcp: TCPSocket): void {
    bus.on("vim after", function(data: VimMessage): boolean | void {
        let msg: string = data.message.substring(3);

        const va: SystemCommand = {
            username: data.username,
            message: msg.trim(),
            //@ts-ignore
            commandType: cmdT.VimAfter,
        };

        const validationResult = validate(va);

        if (!validationResult.success) return console.log("error", validationResult.error);

        console.log("data", va);
        tcp.write(new Command().reset()
                  .setData(getData(va))
                  .setType(getType(va)).buffer
                 );
    });

};
