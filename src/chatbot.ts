import * as Bootbot from 'bootbot';
import { BotHandler } from 'handlers';
import { parsePostBack } from 'utils';
import { PostBackType, Secrets } from 'utils/constants';

class ChatBot {
    private instance = new Bootbot({
        accessToken: Secrets.ACCESS_TOKEN,
        verifyToken: Secrets.VERIFY_TOKEN,
        appSecret: Secrets.APP_SECRET,
    });

    private bot = new BotHandler();

    handlePostBacks = async (payload, chat) => {
        const { payload: data } = payload.postback;
        const postbackData = parsePostBack(data);

        switch (postbackData.type) {
            case PostBackType.SEARCH_VIEW:
                await this.bot.open(payload, chat, postbackData);
                break;

            case PostBackType.READ_MORE:
                await this.bot.readMore(payload, chat, postbackData);
                break;

            case PostBackType.FACEBOOK_WELCOME:
                this.bot.help(payload, chat);
                break;

            case PostBackType.BOOTBOT_GET_STARTED:
                break;

            default:
                chat.say('I can\'t seem to understand what you just said.');
                break;
        }
    }

    start = () => {
        this.instance.hear(/fring (.*)/i, this.bot.search);
        this.instance.on('postback', this.handlePostBacks);

        // Help functions
        this.instance.hear('help', this.bot.help);
        this.instance.setGetStartedButton(this.bot.help);
    }

    getInstance = () => {
        return this.instance;
    }
}

export default ChatBot;
