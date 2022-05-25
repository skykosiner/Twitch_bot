package utils

import (
	"fmt"
	"log"
	"os"
	"strings"
)

func CountWordsInString(str string) int {
    newStr := strings.Split(str, " ")

    var count int

    for i := 0; i < len(newStr); i++ {
        count++
    }

    return count
}


func StringInArray(str string, array []string) bool {
    for _, value := range array {
        if value == str {
            return true
        }
    }

    return false
}

func LogChat(message string) {
    if len(message) >= 70 {
        return
    }

    msg := strings.Split(message, " ")

    if msg[0] == "StreamElements:" || msg[0] == "Nightbot:"  || msg[0] == "yonikosiner:" {
        return
    }

    if CountWordsInString(message) >= 2 && strings.HasPrefix(msg[1], "!") {
        return
    }

    err := os.WriteFile("/home/yoni/chat.txt", []byte(message), 0600)

    if err != nil {
        log.Fatal("Error logging chat to file `utils.go`", err)
    }
}
