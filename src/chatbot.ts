import * as Bootbot from 'bootbot';
import * as dotenv from 'dotenv';

dotenv.config();

const {
    ACCESS_TOKEN,
    VERIFY_TOKEN,
    APP_SECRET,
} = process.env;

const chatbot = new Bootbot({
    accessToken: ACCESS_TOKEN,
    verifyToken: VERIFY_TOKEN,
    appSecret: APP_SECRET,
});

chatbot.on('message', (payload, chat) => {
    const text = payload.message.text;
    chat.say(`Echo: ${text}`);
});

export default chatbot;
