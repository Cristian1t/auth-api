import express from 'express';
import auth from './auth.routes';
import user from './user.routes';

const router = express.Router();

router.get('/health-check', (_, res) => res.sendStatus(200));

router.use(user);
router.use(auth);
export default router;