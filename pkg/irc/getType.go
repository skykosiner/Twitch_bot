package irc

import "strings"

func GetType(msg IrcMessage) MessageType {
    if strings.HasPrefix(msg.Message, "!va") {
        return VimAfter
    } else if strings.HasPrefix(msg.Message, "!vi") {
        return VimInsert
    } else if strings.HasPrefix(msg.Message, "!vc") {
        return VimCommand
    }

	switch msg.Type {
	case VimAfter:
		return VimAfter
	case VimInsert:
		return VimInsert
	case VimCommand:
		return VimCommand
	case SystemCommand:
		return SystemCommand
	default:
		return SystemCommand
	}
}
