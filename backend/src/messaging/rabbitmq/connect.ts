import * as amqp from 'amqplib';
import { QUEUES } from './queues';
import { env } from '../../config/env';

const RABBITMQ_URL =
  env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

let connection: Awaited<ReturnType<typeof amqp.connect>> | undefined;
let channel: amqp.Channel | undefined;

export const connectRabbitMQ = async (): Promise<void> => {

  if (channel) return;

  try {
    console.log('Connecting to RabbitMQ...');

    connection = await amqp.connect(RABBITMQ_URL);

    connection.on('close', () => {
      console.error('RabbitMQ connection closed. Reconnecting...');
      channel = undefined;
      connection = undefined;
      setTimeout(connectRabbitMQ, 5000);
    });

    connection.on('error', (err) => {
      console.error('RabbitMQ error:', err);
    });

    channel = await connection.createChannel();

    for (const queue of Object.values(QUEUES)) {
      await channel.assertQueue(queue, { durable: true });
    }

    console.log('RabbitMQ connected');
    console.log("Connection object:", connection?.constructor.name);

  } catch (err) {
    console.error('RabbitMQ connect failed:', err);
    setTimeout(connectRabbitMQ, 5000);
  }
};

export const getChannel = (): amqp.Channel => {
  if (!channel) {
    throw new Error('RabbitMQ not initialized');
  }
  return channel;
};
