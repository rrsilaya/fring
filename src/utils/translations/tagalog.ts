import { Translation } from 'utils/localization';

const Tagalog: Translation = {
    INVALID_KEYWORD: 'Paumanhin, hindi ko naintindihan ang sinabi mo.',
    HELP_PROMPT: [
        'Kumusta! Ako si Fring. Layunin kong matulungan kang mag-search sa internet nang libre upang mas madaling makuha ang mga ito.',
        'Maaari mo akong tawagin: `fring <search keywords>`. Halimbawa: fring jose rizal',
        'Sana ay matulungan kita!',
    ],
    SEARCH_SUMMARY: 'Narito ang mga resulta sa iyong hinahanap na "#{searchQuery}":',
    EMPTY_SEARCH_RESULT: 'Wala akong nakitang resulta sa iyong hinahanap.',
    SERVER_ERROR: 'Paumanhin, nakaranas ako ng saglit na pagkakamali. Maaari mo bang ulitin ang iyong sinabi?',
    READ_RESULT: 'Basahin',
    RESULT_OPEN_ERROR: 'Hindi ko mabuksan ang webpage na gusto mong basahin. 😢',
    READ_MORE: 'Magbasa Pa',
    READ_MORE_ERROR: 'Paumanhin, hindi ko na maalala ang ating pinag-uusapan.',
    SOURCE: '(Pinagmulan: #{url})',
};

export default Tagalog;
