package irc

import (
	"log"
	"time"

	"github.com/yonikosiner/twitch-bot/pkg/tcp"
)

type SysCommand struct {
	OnCommand     string
	OffCommand    string
	CommandLength int
}

func (s *SysCommand) Add(tcp *tcp.Server, msg IrcMessage) {
	var c *Command = &Command{}
	tcp.Write(c.New(SystemCommand, StatusLine(msg), []byte(s.OnCommand)))

	// If the off command is empty that means there is no off command, so just stop the program before the off command is sent
	if s.OffCommand == "" {
		return
	}

	time.Sleep(time.Duration(s.CommandLength) * time.Second)
	tcp.Write(c.New(SystemCommand, StatusLine(msg), []byte(s.OnCommand)))
}

func SystemCommands(Msg IrcMessage, tcp tcp.Server) {
	m := map[Key]SysCommand{}
	m[Key{"asdf"}] = SysCommand{"setxkbmap -layout us", "setxkbmap -layout real-prog-dvorak", 3}
	m[Key{"!turn off screen"}] = SysCommand{"xrandr --output D4-4 --brightness 0.05", "xrandr --output DP-4 --brightness 1", 5}
	m[Key{"!i3 workspace"}] = SysCommand{"i3 workspace 69", "", 0}
	m[Key{"!change background"}] = SysCommand{"change_background_random", "", 0}

	Msg.Type = SystemCommand

	log.Printf("Running system command", Msg)
	systemCommandType := m[Key{Msg.Message}]

	go func() {
		var s *SysCommand = &systemCommandType
		s.Add(&tcp, Msg)
	}()
}
