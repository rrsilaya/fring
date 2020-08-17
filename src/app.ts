import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as logger from 'morgan';
import { ResponseCode } from 'utils/constants';

import ChatBot from './chatbot';
import router from './router';

class App {
    public app: express.Express;
    public port: number;
    public bot = new ChatBot();

    constructor() {
        this.app = express();
        this.port = this.setPort();

        this.configureServer();
        this.setRoutes();
        this.configureBot();
    }

    public start = (): void => {
        this.app.listen(this.port, (err: any): void => {
            if (err) {
                console.log(err);
            } else {
                console.log(`> Listening to port ${this.port}`);
            }
        });
    }

    private setPort = (): number => +process.env.PORT || 8081;

    private configureServer = (): void => {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(logger('dev'));
    }

    private setRoutes = (): void => {
        this.app.use(router);
    }

    private configureBot = (): void => {
        const router = express.Router();

        this.bot.start();
        router.post('/webhook', (req, res) => {
            this.bot.getInstance().handleFacebookData(req.body);
            return res.sendStatus(ResponseCode.OK);
        });
    }
}

export default App;
