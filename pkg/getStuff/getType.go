package getStuff

import (
	"github.com/yonikosiner/twitch-bot/pkg/irc"
)

func GetType(msg irc.IrcMessage) irc.MessageType {
	switch msg.Type {
	case irc.VimAfter:
		return irc.VimAfter
	case irc.VimInsert:
		return irc.VimInsert
	case irc.VimCommand:
		return irc.VimCommand
	case irc.SystemCommand:
		return irc.SystemCommand
	default:
		return irc.SystemCommand
	}
}
