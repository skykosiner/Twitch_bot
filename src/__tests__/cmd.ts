import Command, { CommandType } from "../cmd";

describe("System command", function() {
    it("should set the type of the cmd", function() {
        const cmd = new Command();

        cmd.setType(CommandType.StatusUpdate);

        expect(cmd.buffer[0]).toEqual(CommandType.StatusUpdate);
    });
})
