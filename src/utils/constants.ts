import * as dotenv from 'dotenv';

dotenv.config();

const {
    ACCESS_TOKEN,
    VERIFY_TOKEN,
    APP_SECRET,
    BING_ACCESS_KEY,
    FIREBASE_API_KEY,
    FIREBASE_DATABASE_URL,
} = process.env;

export const Secrets = {
    ACCESS_TOKEN: ACCESS_TOKEN,
    VERIFY_TOKEN: VERIFY_TOKEN,
    APP_SECRET: APP_SECRET,
    BING_ACCESS_KEY: BING_ACCESS_KEY,
    FIREBASE_API_KEY: FIREBASE_API_KEY,
    FIREBASE_DATABASE_URL: FIREBASE_DATABASE_URL,
}

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
