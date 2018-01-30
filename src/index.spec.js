const test = require('ava');

const RabbitmqPubSub = require('./index');

const bunyan = require('bunyan');

test('test instance with default args', (t) => {
	try {
		const client = new RabbitmqPubSub();
		if (client._url === 'amqp://guest:guest@localhost:5672/') {
			t.pass('ok');
		} else {
			t.fail('bad rabbitmq URL');
		}
	} catch (err) {
		t.fail(err);
	}
});

test('test instance with custom args', (t) => {
	try {
		const opts = {
			url: 'amqp://guest:guest@127.0.0.1:5672/',
			log: bunyan.createLogger({ name: 'newTest' })
		};
		const client = new RabbitmqPubSub(opts);
		if (client._url === opts.url) {
			t.pass('ok');
		} else {
			t.fail('bad rabbitmq URL');
		}
	} catch (err) {
		t.fail(err);
	}
});

test('test subscribe throw without channelName', (t) => {
	try {
		const client = new RabbitmqPubSub();
		const channel = null;

		t.throws(() => {
			client.subscribe(channel, (data) => {
				return data;
			});
		});
	} catch (err) {
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
	} catch (err) {
		t.fail(err);
	}
});

test('test subscription ID as number', async (t) => {
	try {
		const client = new RabbitmqPubSub();
		const channel = 'testSubscriptionChannel';

		const subId = await client.subscribe(channel, (data) => {
			return data;
		});
		if (typeof subId === 'number') {
			t.pass();
		} else {
			t.fail();
		}
	} catch (err) {
		t.fail(err);
	}
});

test('test different subscription ID', async (t) => {
	try {
		const client = new RabbitmqPubSub();
		const channel = 'testSubscriptionChannel2';

		const subId = await client.subscribe(channel, (data) => {
			return data;
		});
		const subId2 = await client.subscribe(channel, (data) => {
			return data;
		});
		if (typeof subId === subId2) {
			t.fail();
		} else {
			t.pass();
		}
	} catch (err) {
		t.fail(err);
	}
});

test('test unSubscribe by sub ID', async (t) => {
	try {
		const client = new RabbitmqPubSub();
		const channel = 'testSubscriptionChannel3';

		const subId = await client.subscribe(channel, (data) => {
			return data;
		});
		client.unsubscribe(subId);
		t.pass();
	} catch (err) {
		t.fail(err);
	}
});
