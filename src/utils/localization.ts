import { English } from './translations';

export enum Language {
    ENGLISH = 'ENGLISH',
    TAGALOG = 'TAGALOG',
}

export type Dialog = string | Array<string>;

export enum DialogType {
    INVALID_KEYWORD = 'INVALID_KEYWORD',
    HELP_PROMPT = 'HELP_PROMPT',
    SEARCH_SUMMARY = 'SEARCH_SUMMARY',
    EMPTY_SEARCH_RESULT = 'EMPTY_SEARCH_RESULT',
    SERVER_ERROR = 'SERVER_ERROR',
    READ_RESULT = 'READ_RESULT',
    RESULT_OPEN_ERROR = 'RESULT_OPEN_ERROR',
    READ_MORE = 'READ_MORE',
    READ_MORE_ERROR = 'READ_MORE_ERROR',
    SOURCE = 'SOURCE',
}

export interface Translation {
    INVALID_KEYWORD: Dialog;
    HELP_PROMPT: Dialog;
    SEARCH_SUMMARY: Dialog;
    EMPTY_SEARCH_RESULT: Dialog;
    SERVER_ERROR: Dialog;
    READ_RESULT: Dialog;
    RESULT_OPEN_ERROR: Dialog;
    READ_MORE: Dialog;
    READ_MORE_ERROR: Dialog;
    SOURCE: Dialog;
}

const translations = {
    [Language.ENGLISH]: English,
}

const _replaceVariables = (text: string, variables = {}): string => {
    while (true) {
        const match = text.match(/#{([A-Za-z0-9]+)}/);

        if (!match) return text;

        const [, variable] = match;
        text = text.replace(`#{${variable}}`, variables[variable]);
    }
}

export const translate = Object.values(Language).reduce((factory, language) => {
    factory[language] = (type: DialogType, variables?: Object): Dialog => {
        const mapping: Translation = translations[language];
        const dialog: Dialog = mapping[type];

        if (Array.isArray(dialog)) {
            return dialog.map((text) => _replaceVariables(text, variables));
        }

        return _replaceVariables(dialog, variables);
    }

    return factory;
}, {});
