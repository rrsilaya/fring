import { FirebaseHandler, SearchHandler } from 'handlers';
import { BotAction, PostBackType } from 'utils/constants';
import { chunkMessage } from 'utils';

class BotHandler {
    private dbHandler = new FirebaseHandler();
    private searchHandler = new SearchHandler();

    help = (_, chat) => {
        chat.sendAction(BotAction.MARK_SEEN);
        chat.say([
            'Hi there! My name is Fring. I can help you search the internet for free. I aim to make information on the internet easily available especially to those without means to get them.',
            'Please use my name "fring" followed by your query to start searching e.g. fring jose rizal.',
            'Make sure you spelled my name correctly so that I know that you\'re calling me.',
            'I\'m still a baby so I can handle 5 search results at most at a time. 😅',
            'Please also like the page in case you haven\'t so that you\'ll be updated with future announcements.',
        ], { typing: true });
    }

    promptSearch = (_, chat) => {
        chat.sendAction(BotAction.MARK_SEEN);
        chat.say([
            'Yes? Would you like to search for something?',
            'Just say my name "fring" followed by your query e.g. fring jose rizal. ♥️',
        ], { typing: true });
    }

    thanks = (_, chat) => {
        chat.sendAction(BotAction.MARK_SEEN);
        chat.say([
            'Sure thing! Let me know when I could be of help.',
            'Please also help me spread the word so that I can help more people. 😊'
        ], { typing: true });
    }

    search = async (_, chat, data): Promise<void> => {
        const [, query] = data.match;

        chat.sendAction(BotAction.MARK_SEEN);
        chat.sendAction(BotAction.TYPING_ON);

        const results = await this.searchHandler.getSearchResults(query);
        chat.sendAction(BotAction.TYPING_OFF);

        console.log(`[SEARCH] User searched for "${query}"`);

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

    open = async (payload, chat, data): Promise<void> => {
        const { data: url } = data;
        const { id: userId } = payload.recipient;
        let title, content;

        chat.sendAction(BotAction.TYPING_ON);
        console.log(`[SEARCH] User opening "${url}"`);

        try {
            const site = await this.searchHandler.getSiteData(url);

            title = site.title;
            content = site.content;
        } catch (error) {
            chat.sendAction(BotAction.TYPING_OFF);
            chat.say('Seems like I can\'t open the page that you want to read. 😢');

            console.log(error);
            return;
        }

        try {
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

    readMore = async (payload, chat, data): Promise<void> => {
        const [threadId, i] = data.data.split('#');
        const { id: userId } = payload.recipient;
        const index = parseFloat(i);

        chat.sendAction(BotAction.TYPING_ON);

        const { text: message, pagesLeft } = await this.dbHandler.getChunk(userId, threadId, index);
        await this.dbHandler.removeChunk(userId, threadId, index);

        chat.sendAction(BotAction.TYPING_OFF);

        if (!message) {
            chat.say('I\'m sorry; I forgot what we\'re talking about. What was it again?');
            return;
        }

        if (pagesLeft < 1) {
            chat.say(message);
            return;
        }

        await chat.say({
            text: message,
            buttons: [{
                type: 'postback',
                title: 'Read More',
                payload: `${PostBackType.READ_MORE}:${threadId}#${index + 1}`,
            }]
        });
    }
}

export default BotHandler;
