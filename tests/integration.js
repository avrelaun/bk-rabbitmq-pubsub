const test = require('ava');

const RabbitmqPubSub = require('../src');

let client;

test.before('instance client', (t) => {
	try {
		client = new RabbitmqPubSub();
		t.pass();
	} catch (e) {
		t.fail(e);
	}
});

test.cb('test integration', (t) => {
	t.plan(1);

	try {
		const channel = 'testChannel1';
		client
			.subscribe(channel, (data) => {
				if (data === 1) {
					t.pass();
				} else {
					t.fail('bad result');
				}
				t.end();
			})
			// when subscibre is ready;
			.then(() => {
				client.publish(channel, 1);
			});
	} catch (err) {
		t.fail(err);
	}
});

test.cb('test integration with publish before and after', (t) => {
	t.plan(1);

	try {
		const channel = 'testChannel2';

		// First publish with nobody listen
		client.publish(channel, 2);

		client
			.subscribe(channel, (data) => {
				if (data === 1) {
					t.pass();
				} else {
					t.fail('bad result');
				}
				t.end();
			})
			// when subscibre is ready;
			.then(() => {
				client.publish(channel, 1);
			});
	} catch (err) {
		t.fail(err);
	}
});

test.cb('test integration with 2 subscribe', (t) => {
	t.plan(2);

	try {
		const channel = 'testChannel2';

		// First publish with nobody listen
		client.publish(channel, 2);

		client.subscribe(channel, (data) => {
			if (data === 1) {
				t.pass();
			} else {
				t.fail('bad result');
			}
		});

		client
			.subscribe(channel, (data) => {
				if (data === 1) {
					t.pass();
				} else {
					t.fail('bad result');
				}
				t.end();
			})
			// when subscibre is ready;
			.then(() => {
				client.publish(channel, 1);
			});
	} catch (err) {
		t.fail(err);
	}
});
