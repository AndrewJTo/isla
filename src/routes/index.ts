import {Router} from 'express';
import * as messageController from '../controllers/message';

export const router = Router();

router.get('/message', messageController.listMessages);
router.post('/message', messageController.createMessage);
