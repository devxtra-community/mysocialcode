import * as amqp from 'amqplib';
import { Channel } from 'amqplib';
import { QUEUES } from './queues';

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

let channel: Channel | null = null;

export const connectRabbitMQ = async (): Promise<void> => {
  if (channel) return;

  try {
    console.log('🔌 Connecting to RabbitMQ...');

    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    // declare queues ONCE
    for (const queue of Object.values(QUEUES)) {
      await channel.assertQueue(queue, { durable: true });
    }

    console.log('RabbitMQ connected');
  } catch (err) {
    console.error('RabbitMQ connection failed', err);
    process.exit(1);
  }
};

export const getChannel = (): Channel => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  return channel;
};
