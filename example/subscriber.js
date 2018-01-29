#!/usr/bin/env node

const RabbitmqRPC = require('../src');

const client = new RabbitmqRPC();

const listener1 = function (data){
	console.log('listener1 ', data);
};

const listener2 = function (data){
	console.log('listener2 ', data);
};

client.subscribe('number', listener1);
client.subscribe('number', listener2);

// setTimeout(() => {
// 	console.log('##### unsubscribe 2');
// 	client.unsubscribe('number',listener2);

// }, 10000);

// setTimeout(() => {
// 	console.log('##### unsubscribe 1');
// 	client.unsubscribe('number',listener1);

// }, 20000);

setTimeout(() => {


}, 10000000);
