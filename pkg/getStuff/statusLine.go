package getStuff

import (
	"fmt"

	"github.com/yonikosiner/twitch-bot/pkg/irc"
)

func StatusLine(data irc.IrcMessage) string {
	name := data.Name

	commandType := GetType(data)

	if commandType == irc.VimInsert || commandType == irc.VimAfter {
		return fmt.Sprintf("%s: Has inserted %s", name, data.Message)
	}

	if commandType == irc.VimCommand {
		return fmt.Sprintf("%s: Vim command %s", name, data.Message)
	}

	if commandType == irc.SystemCommand {
		return fmt.Sprintf("%s: %s", name, data.Message)
	}

	return fmt.Sprintf("%s: %d with %s", name, data.Type, data.Message)
}
