import { Router } from 'express';
import chatbot from './chatbot';

const router = Router();

router.get('/ping', (_, res) => res.send('pong'));
router.get('/webhook', (req, res) => res.send(req.query['hub.challenge']));
router.post('/webhook', (req) => chatbot.handleFacebookData(req.body));

export default router;
