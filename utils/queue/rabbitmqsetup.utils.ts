const amqp = require('amqplib/callback_api');
const { emailVerificationMailgenContents, sendMail } = require('../mail/sendmail.utils');

let channel: any;

export const connectQueue = async () => {
    try {
        await amqp.connect('amqp://localhost', (error0: any, connection: any) => {
            if (error0) {
                throw error0;
            }

            connection.createChannel((error1: any, channelInstance: any) => {
                if (error1) {
                    throw error1;
                }

                channel = channelInstance;

                const queue = 'email-queue';

                channel.assertQueue(queue, {
                    durable: false
                });
            });
            console.log("Successfully connected to RabbitMQ");
        });
    } catch (error) {
        console.log("error in creating connection to queues,rabbitmqsetup file");
    }
}

export const sendDataToQueue = async (data: any) => {
    console.log(data);
    try {
        const queue = 'email-queue';

        await channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));

        console.log(" sendData send this message", data);
    }
    catch (error) {
        console.log("error while sending the data to queue");
        console.log(error);
    }
}

export const consumeDataFromQueue = async () => {
    try {
        amqp.connect('amqp://localhost', (err: any, conn: any) => {
            if (err) throw err;
            const queue = 'email-queue';
            // Listener
            conn.createChannel((err: any, ch2: any) => {
                if (err) throw err;

                ch2.assertQueue(queue, { durable: false });

                ch2.consume(queue, async (data: any) => {
                    if (data !== null) {
                        const emailValues = JSON.parse(data.content.toString());
                        console.log("emailValues", emailValues);

                        await sendMail({
                            email: emailValues.user?.email,
                            subject: "Please verify your email",
                            mailgenContent: emailVerificationMailgenContents(
                                emailValues.user.userName,
                                `${emailValues.req.protocol}://${emailValues.req.get(
                                    "host"
                                )}/api/v1/auth/verify-email/${emailValues.unHashedToken}`
                            ),
                        });
                        ch2.ack(data);
                    }
                });
            });
        });
    } catch (error) {
        console.log("error while consuming the data in queue");
        console.log(error);
    }
}

// module.exports = { connectQueue, sendDataToQueue, consumeDataFromQueue };