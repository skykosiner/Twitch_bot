package irc

import (
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc"
	"github.com/yonikosiner/twitch-bot/pkg/band"
	"github.com/yonikosiner/twitch-bot/pkg/tcp"
)

func VimCommands(tcp *tcp.Server, msg IrcMessage, client *twitch.Client) {
    var b *band.Band = &band.Band{}
    var c *Command = &Command{}

    if b.IsUserBand(msg.Name) {
        message := fmt.Sprintf("Hey, @%s, you're banned", msg.Name)

        client.Say("yonikosiner", message)

        if len(msg.Name) >= 10 {
            tcp.Write(c.New(StatusUpdate, "Hey, you're banned, you can't vim", []byte("")))
        } else {
            tcp.Write(c.New(StatusUpdate, fmt.Sprintf("Sorry @%s you're banned, you can't vim", msg.Name), []byte("")))
        }

        return
    }

	m := map[Key]MessageType{}
	m[Key{"!va"}] = VimAfter
	m[Key{"!vi"}] = VimInsert
	m[Key{"!vc"}] = VimCommand

	vimType := m[Key{strings.Fields(msg.Message)[0]}]
	msg.Type = MessageType(vimType)

	go func() {
        if vimType == VimInsert || vimType == VimAfter || vimType == VimCommand {
            msg.Message = msg.Message[4:]
            tcp.Write(c.New(GetType(msg), StatusLine(msg), GetData(msg)))
        }
	}()
}
