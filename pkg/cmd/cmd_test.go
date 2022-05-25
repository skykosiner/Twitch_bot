package cmd

import "testing"

func TestSetStatusLine(t *testing.T) {
    var c *Command
    c.Reset()
    c.SetStatusLine("Test")
    c.SetType(StatusUpdate)
}
