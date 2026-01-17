import { connectRabbitMQ, getChannel } from "../connect";
import { QUEUES } from "../queues";
import { SendOtpJob } from "../../jobTypes";

const startOtpWorker = async () => {
  await connectRabbitMQ();
  const channel = getChannel();

  channel.prefetch(1); // process one OTP at a time

  console.log("OTP Worker running");

  channel.consume(QUEUES.SEND_OTP, async (msg) => {
    if (!msg) return;

    try {
      const job: SendOtpJob = JSON.parse(msg.content.toString());

      console.log(`Sending OTP ${job.otp} to ${job.phone}`);

      // Here is where Twilio / SMS provider goes
      await new Promise((r) => setTimeout(r, 1500));

      channel.ack(msg);
      console.log("OTP sent");
    } catch (err) {
      console.error("OTP failed", err);
      channel.nack(msg, false, false);
    }
  });
};

startOtpWorker();
