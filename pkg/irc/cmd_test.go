package irc

import (
	"testing"
)

func TestBufferCmd(t *testing.T) {
    msg := IrcMessage{"yoni", "i3 workspace 68", SystemCommand}

    var c *Command = &Command{}
    buffer := c.New(GetType(msg), StatusLine(msg), GetData(msg))

    // TODO: Make this testing thing work
    if buffer[1] != byte(SystemCommand) {
        t.Errorf("Expected type to equal SystemCommand %d", buffer[1])
    }
}
