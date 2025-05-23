const express = require('express');
const Queue = require('bull');
////const QueueMQ = require('bullmq');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');

// const someQueue = new Queue('someQueueName', {
//   redis: { port: 6379, host: '127.0.0.1' },
// }); // if you have a special connection to redis.
const ticketQueue = new Queue('ticket');
const changeQueue = new Queue('change');
const machineQueue = new Queue('machine');
const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath('/admin/queues');

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullAdapter(ticketQueue), new BullAdapter(changeQueue), new BullAdapter(machineQueue)],
  serverAdapter: serverAdapter,
});

const app = express();

app.use('/admin/queues', serverAdapter.getRouter());

// other configurations of your server

app.listen(3010, () => {
  console.log('Running on 3010...');
  console.log('For the UI, open http://localhost:3010/admin/queues');
  console.log('Make sure Redis is running on port 6379 by default');
});