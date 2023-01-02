package utils

import (
	"fmt"
	"log"
	"os"
	"strings"
)

func LogChat(username string, message string) {
	if len(message) >= 70 {
		return
	}

	if username == "StreamElements:" || username == "Nightbot:" {
		return
	}

	if strings.HasPrefix(message, "!") {
		return
	}

	msg := fmt.Sprintf("%s: %s", username, message)

	err := os.WriteFile("/home/yoni/chat.txt", []byte(msg), 0600)

	if err != nil {
		log.Fatal("Error logging chat to file", err)
	}
}
