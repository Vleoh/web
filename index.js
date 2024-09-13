// index.js
const express = require('express');
const amqp = require('amqplib');

const app = express();
const port = process.env.PORT || 3000;

const rabbitmqUrl = 'amqp://localhost:5672'; // Replace with your RabbitMQ URL

async function connectToRabbitMQ() {
  try {
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();
    return channel;
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
}

app.post('/extract', async (req, res) => {
  const { source, sourceType } = req.body;

  try {
    let data;

    // Example: Fetching data from a database
    if (sourceType === 'database') {
      // ... connect to database and fetch data ... 
    } else if (sourceType === 'api') {
      // ... fetch data from API ... 
    } else if (sourceType === 'file') {
      // ... read data from a file ...
    }

    const channel = await connectToRabbitMQ();

    // Publish extracted data to the queue
    await channel.assertQueue('extracted_data');
    await channel.sendToQueue('extracted_data', Buffer.from(JSON.stringify(data)));

    res.status(200).json({ message: 'Data extracted successfully' });
  } catch (error) {
    console.error('Error during data extraction:', error);
    res.status(500).json({ error: 'Error during data extraction' });
  }
});

app.listen(port, () => {
  console.log(`Data Extraction service listening on port ${port}`);
});