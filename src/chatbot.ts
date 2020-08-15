import * as Bootbot from 'bootbot';
import * as dotenv from 'dotenv';
import { SearchHandler } from 'handlers';
import {
    BotAction,
    PostBackType,
    chunkMessage,
    parsePostBack,
} from 'utils';

dotenv.config();

const {
    ACCESS_TOKEN,
    VERIFY_TOKEN,
    APP_SECRET,
} = process.env;

class ChatBot {
    private instance = new Bootbot({
        accessToken: ACCESS_TOKEN,
        verifyToken: VERIFY_TOKEN,
        appSecret: APP_SECRET,
    });
    private searchHandler = new SearchHandler();

    handleSearchQuery = async (_, chat, data) => {
        const [, query] = data.match;

        chat.sendAction(BotAction.TYPING_ON);
        const results = await this.searchHandler.getSearchResults(query);
        chat.sendAction(BotAction.TYPING_OFF);

        if (results.length) {
            const textSummary = results.reduce(
                (response, result, i) => `${response}\n\n[${i + 1}] ${result.name}\n${result.description}\n(${result.url})`,
                `You searched for "${query}". Here are your results:`,
            );
            const selection = results.map((result) => ({
                title: result.name,
                subtitle: result.url,
                buttons: [{
                    type: 'postback',
                    title: 'View',
                    payload: `${PostBackType.SEARCH_VIEW}:${result.url}`,
                }],
            }));

            try {
                await chat.say(chunkMessage(textSummary));
                await chat.sendGenericTemplate(selection, []);
            } catch (error) {
                chat.say('I\'m experiencing a momentary hiccup. Please bear with me.');
                console.log(error);
            }
        } else {
            chat.say('I can\'t seem to find anything related to your query. Can you try again?');
        }
    }

    handleViewSearch = async (_, chat, data) => {
        const { data: url } = data;

        chat.sendAction(BotAction.TYPING_ON);

        try {
            const { title, content } = await this.searchHandler.getSiteData(url);
            chat.sendAction(BotAction.TYPING_OFF);

            await chat.say([
                ...chunkMessage(`${title}\n---\n${content}`),
                `Source: ${url}`,
            ]);
        } catch (error) {
            await chat.say('I\'m experiencing a momentary hiccup. Please bear with me.');
            console.log(error);
        }
    }

    handleHelp = (_, chat) => {
        chat.say([
            'Hi there! My name is Fring. I can help you search the internet for free. I aim to make information on the internet easily available especially to those without means to get them.',
            'You can call me if you need my help: `fring <search query>`',
            'I\'m still a baby so I can handle 5 search results at most at a time. 😅',
        ]);
    }

    handlePostBacks = (payload, chat) => {
        const { payload: data } = payload.postback;
        const postbackData = parsePostBack(data);

        switch (postbackData.type) {
            case PostBackType.SEARCH_VIEW:
                this.handleViewSearch(payload, chat, postbackData);
                break;

            default:
                chat.say('I can\'t seem to understand what you just said.');
                break;
        }
    }

    start = () => {
        this.instance.hear(/fring (.*)/i, this.handleSearchQuery);
        this.instance.on('postback', this.handlePostBacks);

        // Help functions
        this.instance.hear('help', this.handleHelp);
    }

    getInstance = () => {
        return this.instance;
    }
}

export default ChatBot;
