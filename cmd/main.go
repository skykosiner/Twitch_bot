package main

import (
	"log"

	"github.com/joho/godotenv"

	"github.com/yonikosiner/twitch-bot/pkg/irc"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	var t *irc.Twitch = &irc.Twitch{}
	t.Connect()
}
