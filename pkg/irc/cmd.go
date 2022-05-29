package irc

/*
        1             2 - 51               52 - ...?
+---------------+---------------+-------------------------------+
|     type      |   statusline  |           data...             |
+---------------+---------------+-------------------------------+
*/

type Command struct {
	_buffer []byte
}

const typeIdx = 1
const statuslineIdx = 2
const dataIdx = 51

func (c *Command) New(setType MessageType, setStatusLine string, setData []byte) []byte {
    c._buffer = make([]byte, 1 + 2 + 51 + 200)

	if len(setStatusLine) > 50 {
		panic("Status line can only go up to 50")
	}

	if setData == nil {
		return c._buffer
	}

	if len(setData) > 200 {
		panic("Data is overr 200")
	}

	c._buffer[typeIdx] = byte(setType)
    copy(c._buffer[statuslineIdx:dataIdx], []byte(setStatusLine))
    copy(c._buffer[dataIdx:200], []byte(setData))

	return c._buffer
}
