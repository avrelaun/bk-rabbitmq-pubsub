const uuidV4 = require('uuid/v4');

const Connection = require('./connection');
const Logger = require('./logger');
const Event = require('./event');


class RabbitmqPubSub {

	constructor (opts){
		const {
			url = 'amqp://guest:guest@localhost:5672/',
			logLevel = 'info',
			logName = 'RabbitmqPubSub',
			exchangeName = 'RabbitmqPubSub',
			reconnectDelay = 1000,
			subscribeQueueName,
			log
		} = opts || {};

		this._events = new Event();

		this._url = url;
		this._log = log || Logger({
			level: logLevel,
			name: logName
		});

		this.reconnectDelay = reconnectDelay;
		this._connection = new Connection({
			url,
			log: this._log,
			exchangeName,
			reconnectDelay
		});

		this._connection.on('close', () => {
			this._reconnect();
		});
		this.exchangeName = exchangeName;


		this.subscribeQueueName = subscribeQueueName || this.exchangeName + '-subcribeQueue-'+uuidV4();

		this._createSubscribeQueueAndConsume();
		this.publishChannel = this._connection.getChannel();
	}

	_createSubscribeQueueAndConsume (){
		if (this.createSubscribeQueuePromise){
			return this.createSubscribeQueuePromise;
		} else {
			this.createSubscribeQueuePromise = new Promise((resolve, reject) => {
				this._connection.getChannel()
				.then((channel) => {
					return channel.assertQueue(
						this.subscribeQueueName,
						{
							exclusive: true,
							durable: false
						}
					)
					.then(({queue}) => {
						return channel.bindQueue(queue, this.exchangeName, 'default-pubsub')
						.then(() => {
							channel.consume(
								queue,
								(message) => {
									const channelName = message.fields.routingKey;
									const data = JSON.parse(message.content.toString());
									this._events.emit(channelName, data);
								},
								{
									noAck: true
								}
							)
							.then(() => {
								return resolve();
							});
						});
					});
				})
				.catch((err) => {
					return reject(err);
				});
			});
			return this.createSubscribeQueuePromise;
		}
	}

	_bindSubscribeQueue (channelName){
		return this._connection.getChannel()
		.then((channel) => {
			return channel.bindQueue(this.subscribeQueueName, this.exchangeName, channelName)
			.then(() => {
				return channel.close();
			});
		});
	}

	_unbindSubscribeQueue (channelName){
		return this._connection.getChannel()
		.then((channel) => {
			return channel.unbindQueue(this.subscribeQueueName, this.exchangeName, channelName)
			.then(() => {
				return channel.close();
			});
		});
	}

	_reBindAllSubscribe (){
		for (const channelName of this._events.eventNames()){
			this._bindSubscribeQueue(channelName);
		}
	}

	_reconnect (){
		setTimeout(() => {
			this._log.info('rabbimq disconnect. Try to reconnect');
			// get a new channel for publish
			this.publishChannel = this._connection.getChannel();
			this.createSubscribeQueuePromise = null;
			this._createSubscribeQueueAndConsume()
			.then(() => {
				return this._reBindAllSubscribe();
			});
		}, this.reconnectDelay);
	}

	subscribe (channelName, callback){
		if (!channelName){
			throw new Error('you need to provide a channelName');
		}
		this._events.on(channelName, callback);
		return this._createSubscribeQueueAndConsume()
		.then(() => {
			return this._bindSubscribeQueue(channelName);
		});
	}

	unsubscribeAll (channelName){
		if (!channelName){
			throw new Error('you need to provide a channelName');
		}
		this._events.removeAllListeners(channelName);
		return this._unbindSubscribeQueue(channelName);
	}

	unsubscribe (channelName, callback){
		if (!channelName){
			throw new Error('you need to provide a channelName');
		}
		this._events.removeListener(channelName, callback);
		if (this._events.listenerCount(channelName) === 0){
			this._unbindSubscribeQueue(channelName);
		}
	}

	publish (channelName, data){
		if (!channelName){
			throw new Error('you need to provide a channelName');
		}

		return 	new Promise((resolve, reject) => {
			return this.publishChannel
			.then((channel) => {
				const content = new Buffer(JSON.stringify(data));
				channel.publish(this.exchangeName, channelName, content);
				resolve();
			})
			.catch((err) => {
				reject(err);
			});
		});
	}

}


module.exports = RabbitmqPubSub;
