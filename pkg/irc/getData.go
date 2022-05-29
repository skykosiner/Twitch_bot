package irc

import "fmt"


func GetData(data IrcMessage) []byte {
    getType := GetType(data)
    var out []byte

    switch getType {
    case VimAfter:
        out = []byte(fmt.Sprintf("norm a%s", data.Message))
    case VimInsert:
        out = []byte(fmt.Sprintf("norm i%s", data.Message))
    case VimCommand:
        out = []byte(fmt.Sprintf("norm %s", data.Message))
    case SystemCommand:
        out = []byte(fmt.Sprintf("silent! !%s", data.Message))
    }

    return out
}
