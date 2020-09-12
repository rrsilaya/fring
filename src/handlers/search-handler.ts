import axios from 'axios';
import { CognitiveServicesCredentials } from 'ms-rest-azure';
import { v4 as uuidv4 } from 'uuid';
import WebSearchAPIClient from 'azure-cognitiveservices-websearch';
import * as read from 'node-readability';
import { Secrets } from 'utils/constants';

export interface SearchResult {
    id: string;
    name: string;
    url: string;
    description: string;
}

export interface PageData {
    title: string;
    content: string;
}

class SearchHandler {
    private credentials;
    private client;
    private maxResults;

    constructor(accessKey = Secrets.BING_ACCESS_KEY, maxResults = 10) {
        this.credentials = new CognitiveServicesCredentials(accessKey);
        this.client = new WebSearchAPIClient(this.credentials);
        this.maxResults = maxResults;
    }

    async getSearchResults(keyword: string): Promise<Array<SearchResult>> {
        const result = await this.client.web.search(keyword);

        return result.webPages.value.slice(0, this.maxResults).map((result): SearchResult => ({
            id: uuidv4(),
            name: result.name,
            url: result.url,
            description: result.snippet,
        }));
    }

    getSiteData(url: string): Promise<PageData> {
        return new Promise(async (resolve, reject) => {
            try {
                const page = await axios.get(url);

                read(page.data, (err, article) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }

                    return resolve({
                        title: article.title,
                        content: article.textBody,
                    });
                })
            } catch (err) {
                console.log(err);
                return reject(err);
            }

        });
    }
}

export default SearchHandler;
