'use strict';
const test = require('ava');
const bashParser = require('../src');

test('parameter substitution in assignment', t => {
	const result = bashParser('echoword=${other}test');

	t.deepEqual(result, {
		type: 'list',
		andOrs: [
			{
				type: 'andOr',
				left: [
					{
						type: 'simple_command',
						name: {text: ''},
						prefix: {
							type: 'cmd_prefix',
							list: [{
								text: 'echoword=${other}test',
								expansion: [{
									parameter: 'other',
									start: 9,
									end: 17
								}]
							}]
						}
					}
				]
			}
		]
	});
});

test('parameter substitution', t => {
	const result = bashParser('echo word${other}test');
	t.deepEqual(result, {
		type: 'list',
		andOrs: [
			{
				type: 'andOr',
				left: [
					{
						type: 'simple_command',
						name: {text: 'echo'},
						suffix: {
							type: 'cmd_suffix',
							list: [{
								text: 'word${other}test',
								expansion: [{
									parameter: 'other',
									start: 4,
									end: 12
								}]
							}]
						}
					}
				]
			}
		]
	});
});

test('multiple parameter substitution', t => {
	const result = bashParser('echo word${other}t$est');
	t.deepEqual(result, {
		type: 'list',
		andOrs: [
			{
				type: 'andOr',
				left: [
					{
						type: 'simple_command',
						name: {text: 'echo'},
						suffix: {
							type: 'cmd_suffix',
							list: [{
								text: 'word${other}t$est',
								expansion: [{
									parameter: 'other',
									start: 4,
									end: 12
								},
								{
									parameter: 'est',
									start: 13,
									end: 17
								}]
							}]
						}
					}
				]
			}
		]
	});
});

test('command consisting of only parameter substitution', t => {
	const result = bashParser('$other');
	t.deepEqual(result, {
		type: 'list',
		andOrs: [
			{
				type: 'andOr',
				left: [
					{
						type: 'simple_command',
						name: {
							text: '$other',
							expansion: [{
								parameter: 'other',
								start: 0,
								end: 6
							}]
						}
					}
				]
			}
		]
	});
});

test('parameter with use default value', t => {
	const result = bashParser('${other:-default_value}');
	// console.log(JSON.stringify(result, null, 5))
	t.deepEqual(result, {
		type: 'list',
		andOrs: [
			{
				type: 'andOr',
				left: [
					{
						type: 'simple_command',
						name: {
							text: '${other:-default_value}',
							expansion: [{
								parameter: 'other',
								word: {
									text: 'default_value'
								},
								op: 'useDefaultValue',
								start: 0,
								end: 23
							}]
						}
					}
				]
			}
		]
	});
});

test('parameter with assign default value', t => {
	const result = bashParser('${other:=default_value}');
	t.deepEqual(result, {
		type: 'list',
		andOrs: [
			{
				type: 'andOr',
				left: [
					{
						type: 'simple_command',
						name: {
							text: '${other:=default_value}',
							expansion: [{
								parameter: 'other',
								word: {
									text: 'default_value'
								},
								op: 'assignDefaultValue',
								start: 0,
								end: 23
							}]
						}
					}
				]
			}
		]
	});
});

test('parameter with other parameter in word', t => {
	const result = bashParser('${other:=default$value}');
	t.deepEqual(result, {
		type: 'list',
		andOrs: [
			{
				type: 'andOr',
				left: [
					{
						type: 'simple_command',
						name: {
							text: '${other:=default$value}',
							expansion: [{
								parameter: 'other',
								word: {
									text: 'default$value',
									expansion: [{
										parameter: 'value',
										start: 7,
										end: 13
									}]
								},
								op: 'assignDefaultValue',
								start: 0,
								end: 23
							}]
						}
					}
				]
			}
		]
	});
});

test('parameter with indicate error if null', t => {
	const result = bashParser('${other:?default_value}');
	t.deepEqual(result, {
		type: 'list',
		andOrs: [
			{
				type: 'andOr',
				left: [
					{
						type: 'simple_command',
						name: {
							text: '${other:?default_value}',
							expansion: [{
								parameter: 'other',
								word: {
									text: 'default_value'
								},
								op: 'indicateErrorIfNull',
								start: 0,
								end: 23
							}]
						}
					}
				]
			}
		]
	});
});

test('parameter with use alternative value', t => {
	const result = bashParser('${other:+default_value}');
	t.deepEqual(result, {
		type: 'list',
		andOrs: [
			{
				type: 'andOr',
				left: [
					{
						type: 'simple_command',
						name: {
							text: '${other:+default_value}',
							expansion: [{
								parameter: 'other',
								word: {
									text: 'default_value'
								},
								op: 'useAlternativeValue',
								start: 0,
								end: 23
							}]
						}
					}
				]
			}
		]
	});
});
