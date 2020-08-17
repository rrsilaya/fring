export enum BotStatus {
    EVENT_RECEIVED = 'EVENT_RECEIVED',
}

export enum BotAction {
    MARK_SEEN = 'mark_seen',
    TYPING_ON = 'typing_on',
    TYPING_OFF = 'typing_off',
}

export enum PostBackType {
    SEARCH_VIEW = 'SEARCH_VIEW',
    READ_MORE = 'READ_MORE',
    FACEBOOK_WELCOME = 'FACEBOOK_WELCOME',
    BOOTBOT_GET_STARTED = 'BOOTBOT_GET_STARTED',
}

export enum ResponseCode {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
};
