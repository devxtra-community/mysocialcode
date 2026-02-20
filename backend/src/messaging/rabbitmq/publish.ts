import { connectRabbitMQ, getChannel } from './connect';
import { QUEUES, QueueKey } from './queues';

export const publish = async <T>(
  queue: QueueKey,
  payload: T,
): Promise<void> => {
  try {

    await connectRabbitMQ();
  
    const channel = getChannel();
  
    if (!channel) {
      throw new Error('RabbitMQ channel is not available');
    }
  
    const sent = channel.sendToQueue(
      QUEUES[queue], 
      Buffer.from(JSON.stringify(payload)), 
      { persistent: true }
    );
  
    if (!sent) {
      throw new Error('Failed to publish message to RabbitMQ');
    }
  
    console.log(`Job published to ${queue}`);
  } catch (err) {
    console.error('Publish failed: ', err);
    throw err;
  }
};
