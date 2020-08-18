import { Translation } from 'utils/localization';

const English: Translation = {
    INVALID_KEYWORD: 'I can\'t seem to understand what you just said.',
    HELP_PROMPT: [
        'Hi there! My name is Fring. I can help you search the internet for free. I aim to make information on the internet easily available especially to those without means to get them.',
        'You can call me if you need my help: `fring <search query>`',
        'I\'m still a baby so I can handle 5 search results at most at a time. 😅',
    ],
    SEARCH_SUMMARY: 'You searched for "#{searchQuery}". Here are your results:',
    EMPTY_SEARCH_RESULT: 'I can\'t seem to find anything related to your query. Can you try again?',
    SERVER_ERROR: 'I\'m experiencing a momentary hiccup. Please bear with me.',
    READ_RESULT: 'Read',
    RESULT_OPEN_ERROR: 'Seems like I can\'t open the page that you want to read. 😢',
    READ_MORE: 'Read More',
    READ_MORE_ERROR: 'I\'m sorry; I forgot what we\'re talking about. What was it again?',
    SOURCE: '(Source: #{url})',
};

export default English;
