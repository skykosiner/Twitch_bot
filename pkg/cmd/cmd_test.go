package cmd_test

import (
	"fmt"
	"testing"

	"github.com/yonikosiner/twitch-bot/pkg/cmd"
	"github.com/yonikosiner/twitch-bot/pkg/getStuff"
	"github.com/yonikosiner/twitch-bot/pkg/irc"
)

func TestCommand(t *testing.T) {
    var c *cmd.Command = &cmd.Command{}
    buffer := c.New(irc.VimAfter, getStuff.StatusLine(irc.IrcMessage{"yoni", "aoeu", irc.VimAfter}), []byte("hello"))
    fmt.Println(string(buffer))
}
