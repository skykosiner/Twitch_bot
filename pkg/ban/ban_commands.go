package banCommands

import (
	"bufio"
	"fmt"
	"log"
	"os"

	"github.com/gempir/go-twitch-irc"
)

type Ban struct {
	banded []string
}

func (b *Ban) AddBand(username string, client *twitch.Client) {
	b.GetBandFile()

	if b.IsUserBand(username) {
		client.Say(os.Getenv("TWITCH_OAUTH_NAME"), fmt.Sprintf("The user %s is already banned", username))
		return
	}

	// Add the band to banded user file
	f, err := os.OpenFile("./band-users.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)

	if err != nil {
		log.Fatal("Error appending to band file: ", err)
	}

	defer f.Close()

	if _, err := f.WriteString(fmt.Sprintf("%s\n", username)); err != nil {
		log.Fatal("Error appending to band file: ", err)
	}
}

func (b *Ban) IsUserBand(username string) bool {
	b.GetBandFile()
	for _, name := range b.banded {
		if name == username {
			return true
		}
	}

	return false
}

func (b *Ban) GetBandFile() {
	bands, err := os.Open("./band-users.txt")

	if err != nil {
		log.Fatal("Error getting banded users", err)
	}

	scanner := bufio.NewScanner(bands)
	scanner.Split(bufio.ScanLines)
	var text []string

	for scanner.Scan() {
		text = append(text, scanner.Text())
	}

	bands.Close()

	var bannedUsers []string
	bannedUsers = append(bannedUsers, text...)
	b.banded = bannedUsers
}
