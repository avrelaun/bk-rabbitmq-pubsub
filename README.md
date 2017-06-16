# bk-rabbitmq-pubsub

This is a very opinionated abstraction over amqplib to help simplify the implementation of PubSub messaging patterns on RabbitMQ.

> !IMPORTANT! - bk-rabbitmq-pubsub needs nodejs >= 8.x.

### Features:
 * Publish event on a channel with data
 * Subscribe event from a channel and receive data
 * Attempt to gracefully handle lost connections and channels

## Installation

```(bash)
npm install bk-rabbitmq-pubsub
```

## Getting started

```javascript
const RabbitmqPubSub = require('bk-rabbitmq-pubsub');

const pubsub = new RabbitmqPubSub();

// subscribe on the channel myEvent
pubsub.subscribe('myEvent', (data) => {
	console.log(data);
})

// publish event with data on channel MyEvent
pubsub.publish('myEvent', data);

```

## API Reference

### new RabbitmqPubSub(options)
Return a new RabbitmqPubSub pubsub client.
`options` are :
 * 	`url` : URL to connect to RabbitMQ (default : `amqp://guest:guest@localhost:5672/`)
 * `logLevel` : Log level (default : `info`)
 * `logName` : Log name for Bunyan = (default : `RabbitmqRPC`)
 * `exchangeName` : Exchange name for handle RPC request  (default : `RabbitmqRPC`)
 * `log` : Custom log instance (require to implement function trace, debug, info, warn and error)
 * `reconnectDelay` : Reconnection delay in ms after connection close (default `1000`)
 * `subscribeQueueName` : The name for the subscribeQueue, by default it's generated

### {client} subscribe(channelName, function(data) {})
Subscribe on a channel.
`options` are :
* `channelName` : Name of the channel to subscribe. (throw an error if undefined or null)
* `function` : The function call when an event arrive. The function take one arg whose is the data send by the publisher.

### {client} publish(channelName, data)
Subscribe on a channel.
`options` are :
* `channelName` : Name of the channel to subscribe. (throw an error if undefined or null)
* `data` : Data send with the event for the subscribers.

## Contributing

First off, thanks for your interest and for wanting to contribute!
PRs with insufficient coverage, broken tests or deviation from the style will not be accepted.

### Run tests

```bash
# With docker
npm run build-image #to build rabbitmq Image
npm run start-image #to start rabbitmq on localhost
# Or provide your own local rabbitmq install

# run tests
npm test

# run lint
npm run lint

# run coverage
npm run coverage
```

### TODO
 * Add better coverage test
 * Add unsubscribe options
 * ...

## License
MIT License

Copyright (c) 2017 Beekast
