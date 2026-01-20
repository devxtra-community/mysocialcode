import { getChannel } from './connect';
import { QUEUES, QueueKey } from './queues';

export const publish = async <T>(
  queue: QueueKey,
  payload: T,
): Promise<void> => {
  const channel = getChannel();

  channel.sendToQueue(QUEUES[queue], Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });

  console.log(`📨 Job published to ${queue}`);
};
