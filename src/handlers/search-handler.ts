import { CognitiveServicesCredentials } from 'ms-rest-azure';
import { v4 as uuidv4 } from 'uuid';
import WebSearchAPIClient from 'azure-cognitiveservices-websearch';
import * as dotenv from 'dotenv';
import * as read from 'node-readability';

dotenv.config();

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

    constructor(accessKey = process.env.BING_ACCESS_KEY, maxResults = 3) {
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
        return new Promise((resolve, reject) => {
            read(url, (err, article) => {
                if (err) {
                    return reject(err);
                }

                return resolve({
                    title: article.title,
                    content: article.textBody,
                });
            })
        });
    }
}

export default SearchHandler;
