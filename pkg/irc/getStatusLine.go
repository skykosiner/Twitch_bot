package irc

import (
	"fmt"
)

func StatusLine(data IrcMessage) string {
	name := data.Name

	commandType := GetType(data)

	if commandType == VimInsert || commandType == VimAfter {
		return fmt.Sprintf("%s: Has inserted %s", name, data.Message)
	}

	if commandType == VimCommand {
		return fmt.Sprintf("%s: Vim command %s", name, data.Message)
	}

	if commandType == SystemCommand {
		return fmt.Sprintf("%s: %s", name, data.Message)
	}

	return fmt.Sprintf("%s: %d with %s", name, data.Type, data.Message)
}
