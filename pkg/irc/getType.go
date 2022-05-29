package irc

func GetType(msg IrcMessage) MessageType {
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
