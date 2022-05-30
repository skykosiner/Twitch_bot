package irc

import (
	"strings"

	"github.com/yonikosiner/twitch-bot/pkg/tcp"
)

func VimCommands(tcp *tcp.Server, msg IrcMessage) {
	m := map[Key]MessageType{}
	m[Key{"!va"}] = VimAfter
	m[Key{"!vi"}] = VimInsert
	m[Key{"!vc"}] = VimCommand

	vimType := m[Key{strings.Fields(msg.Message)[0]}]
	msg.Type = MessageType(vimType)

	go func() {
        var c *Command = &Command{}

        if vimType == VimInsert || vimType == VimAfter || vimType == VimCommand {
            msg.Message = msg.Message[4:]
            tcp.Write(c.New(GetType(msg), StatusLine(msg), GetData(msg)))
        }
	}()
}
