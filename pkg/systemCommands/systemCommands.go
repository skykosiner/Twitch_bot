package systemcommands

import (
	"time"
)

type SendSystemCommand struct {
	Command string
}

type SystemCommand struct {
	OnCommand     string
	OffCommand    string
	CommandLength int
}

func (s *SystemCommand) Add(channel chan SendSystemCommand) {
	// TOOD: Should we just send the TCP command from here instead of sending to a channel?
	onCommandObject := SendSystemCommand{s.OnCommand}

	if s.OffCommand == "" {
		channel <- onCommandObject
		return
	}

	channel <- onCommandObject

	time.Sleep(time.Duration(s.CommandLength) * time.Second)
	offCommandObject := SendSystemCommand{s.OffCommand}
	channel <- offCommandObject
}
