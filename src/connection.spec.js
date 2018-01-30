const test = require('ava');

const Connection = require('./connection');
const bunyan = require('bunyan');

test('test instance with default args', (t) => {
	try {
		const conn = new Connection({
			log: bunyan.createLogger({ name: 'testConnection' }),
			exchangeName: 'RabbitmqPubSub'
		});
		if (conn.url === 'amqp://guest:guest@localhost:5672/') {
			t.pass('ok');
		} else {
			t.fail('bad rabbitmq URL');
		}
	} catch (err) {
		t.fail(err);
	}
});

test('throw without logger', (t) => {
	t.throws(() => {
		new Connection();
	});
});

test('throw without exchangeName', (t) => {
	const opts = {
		log: bunyan.createLogger({ name: 'testConnection' })
	};
	t.throws(() => {
		new Connection(opts);
	});
});

test('test instance with custom args', (t) => {
	try {
		const opts = {
			url: 'amqp://guest:guest@127.0.0.1:5672/',
			log: bunyan.createLogger({ name: 'newTest' }),
			exchangeName: 'RabbitmqPubSub'
		};
		const conn = new Connection(opts);
		if (conn.url === opts.url) {
			t.pass('ok');
		} else {
			t.fail('bad rabbitmq URL');
		}
	} catch (err) {
		t.fail(err);
	}
});

test('test connection', async (t) => {
	try {
		const opts = {
			log: bunyan.createLogger({ name: 'testConnection' }),
			exchangeName: 'RabbitmqPubSub'
		};
		const conn = new Connection(opts);
		await conn.getConnection();
		// test twice to control not open a new connection
		await conn.getConnection();
		t.pass();
	} catch (err) {
		t.fail(err);
	}
});

test('test createExchange', async (t) => {
	try {
		const opts = {
			log: bunyan.createLogger({ name: 'testConnection' }),
			exchangeName: 'RabbitmqPubSub',
			autoCreateExchange: false
		};
		const conn = new Connection(opts);
		await conn.createExchange();
		// test twice to control not create type twice
		await conn.createExchange();
		t.pass();
	} catch (err) {
		t.fail(err);
	}
});
