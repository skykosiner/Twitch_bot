local TCP = require("twitch-bot.tcp");
local Pobo = require("twitch-bot.pobo");
local EnvClient = require("twitch-bot.envelope");

local M = {}

function M.init()
    local vwm_host = "localhost"
    M._tcp = TCP:new(vwm_host, 42069)
    M._env = EnvClient:new(M._tcp)
    M._env:connect()
    M._env:on("connect", function()
        print("Connected to the server")
    end)

    M._env:on("data", function(data)
        local function dataToString(data)
           return string.format("%s", table.concat(data, '') )
        end

        local function asciiToString(data)
            local str = ""
            for i = 1, #data do
                str = str .. string.format("%c", data[i])
            end
            return str
        end

        vim.cmd("norm " .. asciiToString(data))

        print(asciiToString(data))
    end)
end

return M
