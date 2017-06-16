#!/usr/bin/env node

const RabbitmqPubSub = require('../src');

const client = new RabbitmqPubSub();

let i = 0;

setInterval(() => {
	console.log('number ', i);
	client.publish('number', i);
	i++;
}, 1000);
