#!/usr/bin/env node

const RabbitmqRPC = require('../src');

const client = new RabbitmqRPC();

client.subscribe('number', (data) => {
	console.log('subscribe1 ', data);
});

client.subscribe('number', (data) => {
	console.log('subscribe2 ', data);
});

setTimeout(() => {


}, 10000000);
