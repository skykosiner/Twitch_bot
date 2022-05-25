package band

import (
	"bufio"
	"fmt"
	"log"
	"os"

	"github.com/gempir/go-twitch-irc"
	"github.com/yonikosiner/twitch-bot/pkg/utils"
)

type Band struct {
    banded []string
}

func (b *Band) AddBand(username string, client *twitch.Client) {
    b.getBandFile()

    if utils.StringInArray(username, b.banded) {
        msg := fmt.Sprintf("The user %s is already banned", username)
        client.Say(os.Getenv("TWITCH_OAUTH_NAME"), msg)
        return
    }

    b.banded = append(b.banded, username)

    // TODO: Add to statusline that user is banded
    f, err := os.OpenFile("./band-users.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0600)

    if err != nil {
        log.Fatal(err)
    }

    if _, err := fmt.Fprintf(f, "%s\n", username); err != nil {
        log.Fatal(err)
    }
    if err := f.Close(); err != nil {
        log.Fatal(err)
    }

    log.Printf("The user %s has been banned", username)
}

func (b *Band) IsUserBand(username string) bool {
    b.getBandFile()
    return utils.StringInArray(username, b.banded)
}

func (b *Band) getBandFile() {
    bands, err := os.Open("./band-users.txt")

    if err != nil {
        log.Fatal(err)
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
