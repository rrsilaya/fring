import { FirebaseHandler, SearchHandler } from 'handlers';
import { BotAction, PostBackType } from 'utils/constants';
import { DialogType, translate } from 'utils/localization';
import { chunkMessage } from 'utils';

class BotHandler {
    private dbHandler = new FirebaseHandler();
    private searchHandler = new SearchHandler();

    help = (_, chat) => {
        chat.say(translate[chat.language](DialogType.HELP_PROMPT), { typing: true });
    }

    search = async (_, chat, data): Promise<void> => {
        const [, query] = data.match;

        chat.sendAction(BotAction.MARK_SEEN);
        chat.sendAction(BotAction.TYPING_ON);

        const results = await this.searchHandler.getSearchResults(query);
        chat.sendAction(BotAction.TYPING_OFF);

        if (results.length) {
            const resultSummaries = results.map((result) => ({
                text: `${result.name}\n---\n${result.description}\n${translate[chat.language](DialogType.SOURCE, { url: result.url })}`,
                buttons: [{
                    type: 'postback',
                    title: translate[chat.language](DialogType.READ_RESULT),
                    payload: `${PostBackType.SEARCH_VIEW}:${result.url}`,
                }],
            }));

            try {
                await chat.say(translate[chat.language](DialogType.SEARCH_SUMMARY, { searchQuery: query }));
                await chat.say(resultSummaries);
            } catch (error) {
                chat.say(translate[chat.language](DialogType.SERVER_ERROR));
                console.log(error);
            }
        } else {
            chat.say(translate[chat.language](DialogType.EMPTY_SEARCH_RESULT));
        }
    }

    open = async (payload, chat, data): Promise<void> => {
        const { data: url } = data;
        const { id: userId } = payload.recipient;
        let title, content;

        chat.sendAction(BotAction.TYPING_ON);

        try {
            const site = await this.searchHandler.getSiteData(url);

            title = site.title;
            content = site.content;
        } catch (error) {
            chat.sendAction(BotAction.TYPING_OFF);
            chat.say(translate[chat.language](DialogType.RESULT_OPEN_ERROR));

            console.log(error);
            return;
        }

        try {
            const chunks = chunkMessage(`${title}\n${translate[chat.language](DialogType.SOURCE, { url })}\n---\n${content}`);
            const criticalText = chunks[0];

            if (chunks.length > 1) {
                const threadId = await this.dbHandler.savePaginatedThread(userId, chunks);
                await this.dbHandler.removeChunk(userId, threadId, 0);

                chat.sendAction(BotAction.TYPING_OFF);

                await chat.say({
                    text: criticalText,
                    buttons: [{
                        type: 'postback',
                        title: translate[chat.language](DialogType.READ_MORE),
                        payload: `${PostBackType.READ_MORE}:${threadId}#1`,
                    }],
                });
            } else {
                chat.sendAction(BotAction.TYPING_OFF);
                chat.say(criticalText);
            }
        } catch (error) {
            chat.sendAction(BotAction.TYPING_OFF);
            chat.say(translate[chat.language](DialogType.SERVER_ERROR));
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
            chat.say(translate[chat.language](DialogType.READ_MORE_ERROR));
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
                title: translate[chat.language](DialogType.READ_MORE),
                payload: `${PostBackType.READ_MORE}:${threadId}#${index + 1}`,
            }]
        });
    }
}

export default BotHandler;
