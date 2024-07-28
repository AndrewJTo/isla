import {Request, Response, NextFunction} from 'express';
import {parseMessage, MessageParseError} from '../utils/messageParser';
import * as dbMessage from '../db/message';
import {ErrorHandler} from '../types/error';

export function createMessage(req: Request, res: Response, next: NextFunction) {
  const text = req.body;

  if (!text || typeof text !== 'string') {
    next(new ErrorHandler(400, 'Must send text in request body'));
  }

  try {
    const newMessage = parseMessage(text);

    const createdMessage = dbMessage.createMessage(newMessage);

    res.json(createdMessage);
  } catch (err) {
    if (err instanceof MessageParseError) {
      next(new ErrorHandler(400, err.message));
      return;
    }
    next(err);
  }
}

export function listMessages(req: Request, res: Response) {
  res.json(dbMessage.listMessages());
}
