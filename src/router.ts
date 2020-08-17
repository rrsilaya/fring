import { Router } from 'express';
import { ResponseCode } from 'utils';
import ChatBot from './chatbot';

const router = Router();

router.get('/ping', (_, res) => res.send('pong'));
router.get('/webhook', (req, res) => res.send(req.query['hub.challenge']));
router.post('/webhook', (req, res) => {
    const chatbot = new ChatBot();

    chatbot.start();
    chatbot.getInstance().handleFacebookData(req.body);

    return res.sendStatus(ResponseCode.OK);
});

export default router;
