import { Router } from 'express';

const router = Router();

router.get('/ping', (_, res) => res.send('pong'));
router.get('/webhook', (req, res) => res.send(req.query['hub.challenge']));

export default router;
