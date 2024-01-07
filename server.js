const express = require("express");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 1809;
const TelegramBot = require("node-telegram-bot-api");
const token = "6924858012:AAEr70Vrbc9_nVYlu1IORn5yvEkyiF76_Ik";
const bot = new TelegramBot(token, { polling: true });

const { exec } = require('child_process');

app.get('/', function (req, res) {
    res.send("Linux Action Bot");
    // exec(command, (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`Error: ${error.message}`);
    //         return;
    //     }
    //     if (stderr) {
    //         console.error(`stderr: ${stderr}`);
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    // });
})
const initialKeyboard = [
    ["Restart Keyboard"],
    ["Max Vol", "Mute"],
    ["Open VSCode", "Stacer"],
    ["On/Off Action"]
]
const initialreplyMarkup = {
    keyboard: initialKeyboard,
    resize_keyboard: true,
    one_time_keyboard: false

};
function performAction(command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}
function getAction(chatId, command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        bot.sendMessage(chatId, stdout);
    });
}
bot.on("message", (message) => {
    console.log(message.text);
    const chatId = message.chat.id;
    if (message.text.includes("/start") || message.text.includes("Restart Keyboard")) {

        bot.sendMessage(chatId, `Bot on, keyboard available`, {
            reply_markup: initialreplyMarkup,
        });
    }
    if (message.text == ("On/Off Action")) {
        const replyMarkup = {
            keyboard: [
                ["Shut down", "Restart"],
                ["Cancel On/Off"]
            ],
            resize_keyboard: true,
            one_time_keyboard: true

        };
        bot.sendMessage(chatId, `Bot on, keyboard available`, {
            reply_markup: replyMarkup,
        });
    }
    if (message.text == ("Open VSCode")) {
        performAction('code')
    }
    if (message.text == ("Mute")) {
        getAction(chatId, 'amixer sset Master 0%')
    }
    if (message.text == ("Max Vol")) {
        getAction(chatId, 'amixer sset Master 100%')
    }
    if (message.text == ("Restart")) {
        getAction(chatId, 'sleep 5 ; shutdown -r now')
    }
    if (message.text == ("Shutdown")) {
        getAction(chatId, 'sleep 5 ; shutdown -h now')
    }
    if (message.text == ("ls")) {
        getAction(chatId, 'ls')
    }
    if (message.text == ("test")) {
        getAction(chatId, 'cd .. ; ls')
    }
    if (message.text == ("Stacer")) {
        getAction(chatId, 'stacer')
    }
    if (message.text == ("Cancel On/Off")) {
        bot.sendMessage(chatId, `Cancelled`, {
            reply_markup: initialreplyMarkup,
        });
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});