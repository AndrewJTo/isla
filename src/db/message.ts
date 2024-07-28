import {DBObject, Message} from '../types/message';

const dBMessages: DBObject<Message>[] = [];

export function createMessage(newMessage: Message): DBObject<Message> {
  const createdDbMessage = {
    id: dBMessages.length,
    ...newMessage,
  };

  dBMessages.push(createdDbMessage);

  return createdDbMessage;
}

export function listMessages(): DBObject<Message>[] {
  return dBMessages;
}
