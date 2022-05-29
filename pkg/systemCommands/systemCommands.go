package systemcommands

import (
	"time"

	"github.com/yonikosiner/twitch-bot/pkg/cmd"
	"github.com/yonikosiner/twitch-bot/pkg/getStuff"
	"github.com/yonikosiner/twitch-bot/pkg/irc"
	"github.com/yonikosiner/twitch-bot/pkg/tcp"
)

type SendSystemCommand struct {
	Command string
}

type SystemCommand struct {
	OnCommand     string
	OffCommand    string
	CommandLength int
}

func (s *SystemCommand) Add(tcp *tcp.Server, msg irc.IrcMessage) {
	var c *cmd.Command = &cmd.Command{}
	tcp.Write(c.New(irc.SystemCommand, getStuff.StatusLine(msg), []byte(s.OnCommand)))

	// If the off command is empty that means there is no off command, so just stop the program before the off command is sent
	if s.OffCommand == "" {
		return
	}

	time.Sleep(time.Duration(s.CommandLength) * time.Second)
	tcp.Write(c.New(irc.SystemCommand, getStuff.StatusLine(msg), []byte(s.OnCommand)))
}
