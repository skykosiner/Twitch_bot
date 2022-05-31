package irc

import (
	"fmt"
	"os/exec"
	"time"

	"github.com/yonikosiner/twitch-bot/pkg/band"
	"github.com/yonikosiner/twitch-bot/pkg/tcp"
)

type SysCommand struct {
	OnCommand     string
	OffCommand    string
	CommandLength int
}

func (s *SysCommand) Add(tcp *tcp.Server, msg IrcMessage) {
    onMsg := IrcMessage{msg.Name, s.OnCommand, SystemCommand}
    offMsg := IrcMessage{msg.Name, s.OffCommand, SystemCommand}

	var c *Command = &Command{}
	tcp.Write(c.New(SystemCommand, StatusLine(msg), GetData(onMsg)))

	// If the off command is empty that means there is no off command, so just stop the program before the off command is sent
	if s.OffCommand == "" {
		return
	}

	time.Sleep(time.Duration(s.CommandLength) * time.Second)
	tcp.Write(c.New(SystemCommand, StatusLine(msg), GetData(offMsg)))
}

func SystemCommands(Msg IrcMessage, tcp tcp.Server) {
    var b *band.Band = &band.Band{}

    if b.IsUserBand(Msg.Name) {
        return
    }

    // Run script in my .dotfiles to get the main screen
    stdout, err := exec.Command("get_main_screen").Output()

    if err != nil {
        panic(fmt.Sprintf("Sorry there was an error with getting the main montior %s", err))
    }

	m := map[Key]SysCommand{}
	m[Key{"asdf"}] = SysCommand{"setxkbmap -layout us", "setxkbmap -layout real-prog-dvorak", 3}
	m[Key{"!turn off screen"}] = SysCommand{fmt.Sprintf("xrandr --output %s --brightness 0.05", string(stdout)), fmt.Sprintf("xrandr --output %s --brightness 1", string(stdout)), 5}
	m[Key{"!i3 workspace"}] = SysCommand{"i3 workspace 69", "", 0}
	m[Key{"!change background"}] = SysCommand{"change_background_random", "", 0}

	systemCommandType := m[Key{Msg.Message}]

    if systemCommandType.OnCommand != "" {
        Msg.Type = SystemCommand
    }

	go func() {
        if Msg.Type == SystemCommand {
            var s *SysCommand = &systemCommandType
            s.Add(&tcp, Msg)
        }
	}()
}
