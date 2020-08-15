import * as Bootbot from 'bootbot';
import * as dotenv from 'dotenv';
import { SearchHandler } from 'handlers';
import { chunkMessage } from 'utils';

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

chatbot.hear(/fring (.*)/i, (_, chat, data) => {
    const handler = new SearchHandler();

    const handlePageOpen = async (payload, convo) => {
        const { payload: url } = payload.postback;

        const { title, content } = await handler.getSiteData(url);
        const chunks = chunkMessage(`${title}\n---\n${content}`);

        for (let chunk of chunks) {
            await convo.say(chunk);
        }

        convo.say(`Source: ${url}`);
        convo.end();
    };

    chat.conversation(async (convo) => {
        const [, query] = data.match;
        const results = await handler.getSearchResults(query);

        const textResults = results.reduce((response, result, i) => `${response}\n\n[${i + 1}] ${result.name}\n${result.description}\n(${result.url})`, 'Here are your results:');

        await convo.say(textResults);
        await convo.ask({
            text: 'Which page would you like to view?',
            buttons: results.map((result, i) => ({
                type: 'postback',
                title: `[${i + 1}] ${result.name}`,
                payload: result.url,
            })),
        }, handlePageOpen);
    });
});

export default chatbot;
