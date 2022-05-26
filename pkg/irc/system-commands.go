package irc

import (
	"fmt"

	systemcommands "github.com/yonikosiner/twitch-bot/pkg/systemCommands"
)

func SystemCommands(Msg IrcMessage, channel chan systemcommands.SendSystemCommand) {
	m := map[Key]systemcommands.SystemCommand{}
	m[Key{"asdf"}] = systemcommands.SystemCommand{"setxkbmap -layout us", "setxkbmap -layout real-prog-dvorak", 3}
	m[Key{"!turn off screen"}] = systemcommands.SystemCommand{"xrandr --output D4-4 --brightness 0.05", "xrandr --output DP-4 --brightness 1", 5}
	m[Key{"!i3 workspace"}] = systemcommands.SystemCommand{"i3 workspace 69", "", 0}
	m[Key{"!change background"}] = systemcommands.SystemCommand{"change_background_random", "", 0}

	Msg.Type = SystemCommand

	fmt.Println("systemcommand?", Msg)
	systemCommandType := m[Key{Msg.Message}]

	go func() {
		var s *systemcommands.SystemCommand = &systemCommandType
		s.Add(channel)
	}()
}
