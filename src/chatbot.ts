import * as Bootbot from 'bootbot';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { FirebaseHandler, SearchHandler } from 'handlers';
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
    private dbHandler = new FirebaseHandler();

    handleSearchQuery = async (_, chat, data) => {
        const [, query] = data.match;

        chat.sendAction(BotAction.TYPING_ON);
        const results = await this.searchHandler.getSearchResults(query);
        chat.sendAction(BotAction.TYPING_OFF);

        if (results.length) {
            const resultSummaries = results.map((result) => ({
                text: `${result.name}\n---\n${result.description}\n(Source: ${result.url})`,
                buttons: [{
                    type: 'postback',
                    title: 'Read',
                    payload: `${PostBackType.SEARCH_VIEW}:${result.url}`,
                }],
            }));

            try {
                await chat.say(`You searched for "${query}". Here are your results:`);
                await chat.say(resultSummaries);
            } catch (error) {
                chat.say('I\'m experiencing a momentary hiccup. Please bear with me.');
                console.log(error);
            }
        } else {
            chat.say('I can\'t seem to find anything related to your query. Can you try again?');
        }
    }

    handleViewSearch = async (payload, chat, data) => {
        const { data: url } = data;
        const { id: userId } = payload.recipient;

        chat.sendAction(BotAction.TYPING_ON);

        try {
            const { title, content } = await this.searchHandler.getSiteData(url);

            const chunks = chunkMessage(`${title}\n(Source: ${url})\n---\n${content}`);
            const criticalText = chunks[0];

            if (chunks.length > 1) {
                const threadId = await this.dbHandler.savePaginatedThread(userId, chunks);
                await this.dbHandler.removeChunk(userId, threadId, 0);

                chat.sendAction(BotAction.TYPING_OFF);

                await chat.say({
                    text: criticalText,
                    buttons: [{
                        type: 'postback',
                        title: 'Read More',
                        payload: `${PostBackType.READ_MORE}:${threadId}#1`,
                    }],
                });
            } else {
                chat.sendAction(BotAction.TYPING_OFF);
                chat.say(criticalText);
            }
        } catch (error) {
            chat.sendAction(BotAction.TYPING_OFF);
            chat.say('I\'m experiencing a momentary hiccup. Please bear with me.');
            console.log(error);
        }
    }

    handlePaginatedMessage = async (payload, chat, data) => {
        const [threadId, i] = data.data.split('#');
        const { id: userId } = payload.recipient;
        const index = parseFloat(i);

        chat.sendAction(BotAction.TYPING_ON);
        const message = await this.dbHandler.getChunk(userId, threadId, index);
        await this.dbHandler.removeChunk(userId, threadId, index);
        chat.sendAction(BotAction.TYPING_OFF);

        if (!message) {
            chat.say('I\'m sorry; I forgot what we\'re talking about. What was it again?');
            return;
        }

        await chat.say({
            text: message,
            buttons: [{
                type: 'postback',
                title: 'Read More',
                payload: `${PostBackType.READ_MORE}:${threadId}#${index + 1}`,
            }],
        });
    }

    handleHelp = (_, chat) => {
        chat.say([
            'Hi there! My name is Fring. I can help you search the internet for free. I aim to make information on the internet easily available especially to those without means to get them.',
            'You can call me if you need my help: `fring <search query>`',
            'I\'m still a baby so I can handle 5 search results at most at a time. 😅',
        ]);
    }

    handlePostBacks = async (payload, chat) => {
        const { payload: data } = payload.postback;
        const postbackData = parsePostBack(data);

        switch (postbackData.type) {
            case PostBackType.SEARCH_VIEW:
                await this.handleViewSearch(payload, chat, postbackData);
                break;

            case PostBackType.READ_MORE:
                await this.handlePaginatedMessage(payload, chat, postbackData);
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
