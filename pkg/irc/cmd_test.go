package irc

import (
	"fmt"
	"testing"
)

func TestBufferCmd(t *testing.T) {
    msg := IrcMessage{"yoni", "i3 workspace 68", SystemCommand}

    var c *Command = &Command{}
    buffer := c.New(GetType(msg), StatusLine(msg), GetData(msg))

    fmt.Println(string(buffer))
    fmt.Println(buffer[1])
    fmt.Println(string(buffer[2:51]))
    fmt.Println(string(buffer[51:200]))

    // TODO: Make this testing thing work
    if buffer[1] != 9 && string(buffer[2:51]) != "yoni: i3 workspace 69" && string(buffer[51:200]) != "silent! !i3 workspace 69" {
        t.Errorf("No bitches")
    }
}
