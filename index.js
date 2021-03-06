'use strict';
const ipRegex = require('ip-regex');
const tlds = require('tlds');

module.exports = opts => {
	opts = Object.assign({strict: true, local: false}, opts);

	const protocol = '(?:(?:[a-z]+:)?//)';
	const auth = '(?:\\S+(?::\\S*)?@)?';
	const ip = ipRegex.v4().source;
	const host = '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)';
	const domain = '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*';
	const tld = `(?:\\.${opts.strict ? '(?:[a-z\\u00a1-\\uffff]{2,})' : `(?:${tlds.sort((a, b) => b.length - a.length).join('|')})`})\\.?`;
	const port = '(?::\\d{2,5})?';
	const path = '(?:[/?#][^\\s"]*)?';
	const regex = `(?:(?:${protocol}${opts.strict ? '' : '?'}|www\\.)${auth}(?:localhost|${ip}|${host}${domain}${tld})${opts.local ? `|${protocol}${host}` : ''})${port}${path}`;

	return opts.exact ? new RegExp(`(?:^${regex}$)`, 'i') : new RegExp(regex, 'ig');
};
