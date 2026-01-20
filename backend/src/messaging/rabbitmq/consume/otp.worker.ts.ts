import { connectRabbitMQ, getChannel } from '../connect';
import { QUEUES } from '../queues';
import { SendOtpJob } from '../../jobTypes';
import { sendOtpSms } from '../../../Services/sms.service';
import { appDataSource } from '../../../data-source';
import { Otp } from '../../../entities/otp';
import { ConsumeMessage } from 'amqplib';

const MAX_RETRIES = 3;

const startOtpWorker = async () => {
  await appDataSource.initialize();
  console.log('Worker DB connected');

  await connectRabbitMQ();
  const channel = getChannel();
  const otpRepo = appDataSource.getRepository(Otp);

  channel.prefetch(1);
  console.log('OTP Worker running');

  channel.consume(QUEUES.SEND_OTP, async (msg: ConsumeMessage | null) => {
    if (!msg) return;

    let job: SendOtpJob;

    try {
      job = JSON.parse(msg.content.toString());
    } catch {
      console.error('Invalid message format');
      channel.ack(msg);
      return;
    }

    const otpRecord = await otpRepo.findOne({
      where: { requestId: job.requestId },
    });

    if (!otpRecord || otpRecord.sent) {
      channel.ack(msg);
      return;
    }

    try {
      console.log(
        `Sending OTP to ${job.phone} (attempt ${job.retryCount + 1})`,
      );

      await sendOtpSms(job.phone, job.otp);

      otpRecord.sent = true;
      await otpRepo.save(otpRecord);

      console.log('OTP sent successfully');
      channel.ack(msg);
    } catch (err) {
      console.error('OTP sending failed', err);

      if (job.retryCount < MAX_RETRIES) {
        const retryJob: SendOtpJob = {
          ...job,
          retryCount: job.retryCount + 1,
        };

        try {
          channel.sendToQueue(
            QUEUES.SEND_OTP,
            Buffer.from(JSON.stringify(retryJob)),
            { persistent: true },
          );

          console.log(`Retry queued (attempt ${retryJob.retryCount})`);
          channel.ack(msg);
        } catch (enqueueErr) {
          console.error('Retry enqueue failed', enqueueErr);
          return;
        }
      } else {
        try {
          channel.sendToQueue(
            QUEUES.SEND_OTP_DLQ,
            Buffer.from(JSON.stringify(job)),
            { persistent: true },
          );

          console.error(
            `OTP moved to DLQ after ${job.retryCount} retries for ${job.phone}`,
          );

          channel.ack(msg);
        } catch (dlqErr) {
          console.error('DLQ enqueue failed', dlqErr);
          return;
        }
      }
    }
  });
};

startOtpWorker();
