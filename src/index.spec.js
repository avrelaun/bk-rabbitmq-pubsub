const test = require('ava');

const RabbitmqPubSub = require('./index');

const bunyan = require('bunyan');

test('test instance with default args', (t) => {
	try {
		const client = new RabbitmqPubSub();
		if (client._url === 'amqp://guest:guest@localhost:5672/'){
			t.pass('ok');
		} else {
			t.fail('bad rabbitmq URL');
		}
	} catch (err){
		t.fail(err);
	}
});


test('test instance with custom args', (t) => {
	try {
		const opts = {
			url: 'amqp://guest:guest@127.0.0.1:5672/',
			log: bunyan.createLogger({name: 'newTest'})
		};
		const client = new RabbitmqPubSub(opts);
		if (client._url === opts.url){
			t.pass('ok');
		} else {
			t.fail('bad rabbitmq URL');
		}
	} catch (err){
		t.fail(err);
	}
});

test('test subcribe throw without channelName', (t) => {
	try {
		const client = new RabbitmqPubSub();
		const channel = null;

		t.throws(() => {
			client.subscribe(channel, (data) => {
				return data;
			});
		});
	} catch (err){
		t.fail(err);
	}
});

test('test publish throw without channelName', (t) => {
	try {
		const client = new RabbitmqPubSub();
		const channel = null;

		t.throws(() => {
			client.publish(channel, {});
		});
	} catch (err){
		t.fail(err);
	}
});

test('test subscribe function', (t) => {
	try {
		const client = new RabbitmqPubSub();
		const channel = 'channelTest';

		t.is(client._subscribes.length, 0);
		client.subscribe(channel, (data) => { return data; });
		if (client._subscribes[channel]){
			t.pass();
		} else {
			t.fail('no subscribe function');
		}
	} catch (err){
		t.fail(err);
	}
});
