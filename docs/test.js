const c25 = 'abcdefghijklmnopqrstuvwxy';
const c100 = c25 + c25 + c25 + c25;
const c125 = c100 + c25;
const a10k = [];
for (let i = 0; i < 100; i++) {
	a10k.push(c100);
}
const c10k = a10k.join('');
class Test {
	constructor() {
		this.fetcher = new Fetcher();
		const urlInput = document.getElementById('targetUrl');
		this.url = urlInput.value;
		console.log(this.url);
	}
	async doTestExec(event, logger) {
		const gropeNameLimit = 'grp' + c125;
		const fileNameLimit = 'fil' + c125;
		const fileNameLimit1 = 'fi1' + c125;
		const fileNameLimit2 = 'fi2' + c125;
		const fileNameLimit3 = 'fi3' + c125;
		const hashLimit = 'has' + c125;
		const dataLimit = '123' + c10k;
		const gropeNameOrver = 'grop' + c125;
		const fileNameOrver = 'file' + c125;
		const hashOrver = 'hash' + c125;
		const dataOrver = '123' + c10k;
		await this.getLogA(logger, '', '', '', '', '');
		await this.postLogA(logger, 'a', 'a', 'ax.a', 'aa', 'aaaa');
		await this.postLogA(logger, 'a', 'a', 'aa1.a', 'aaa1', 'aa1aaaaaaaaaaaa');
		await this.postLogA(logger, 'a', 'a', 'aa2.a', 'aaa2', 'aa2aaaaaaaaaaaa');
		await this.getLogA(logger, 'get', 'a', 'aa2.a', '', '');
		await this.postLogA(logger, 'a', 'a', 'aa3.a', 'aaa3', 'aa3aaaaaaaaaaaa');
		await this.postLogA(logger, 'a', 'a', 'aa4.a', 'aaa4', 'aa3aaaaaaaaaaaa');
		await this.postLogA(logger, 'a', 'a', 'aa5.a', 'aaa5', 'aa3aaaaaaaaaaaa');
		await this.postLogA(logger, 'a', 'a', 'aa6.a', 'aaa6', 'aa3aaaaaaaaaaaa');
		await this.postLogA(logger, 'a', 'a', 'aa7.a', 'aaa7', 'aa3aaaaaaaaaaaa');
		await this.postLogA(logger, 'a', 'a', 'aa8.a', 'aaa8', 'aa3aaaaaaaaaaaa');
		await this.postLogA(logger, 'a', gropeNameLimit, fileNameLimit, hashLimit, dataLimit);
		await this.postLogA(logger, 'a', gropeNameOrver, fileNameLimit1, hashLimit, dataLimit);
		await this.postLogA(logger, 'a', gropeNameLimit, fileNameOrver, hashLimit, dataLimit);
		await this.postLogA(logger, 'a', gropeNameLimit, fileNameLimit2, hashOrver, dataLimit);
		await this.postLogA(logger, 'a', gropeNameLimit, fileNameLimit3, hashLimit, dataOrver);
		await this.getLogA(logger, 'b', 'b', 'b', 'b', 'b');
		await this.getLogA(logger, 'get', 'b', 'b', 'b', 'b');
		await this.getLogA(logger, 'get', 'a', 'b', 'b', 'b');
		await this.getLogA(logger, 'get', gropeNameLimit, fileNameLimit, '', '');
		await this.getLogA(logger, 'get', gropeNameLimit, fileNameLimit1, '', '');
		await this.getLogA(logger, 'get', gropeNameLimit, fileNameLimit2, '', '');
		await this.getLogA(logger, 'get', gropeNameLimit, fileNameLimit3, '', '');
		await this.getLogA(logger, 'get', 'a', 'aa3.a', '', '');
		await this.getLogA(logger, 'get', 'a', 'aa2.a', '', '');
		await this.getLogA(logger, 'get', 'a', 'aa4.a', '', '');
		await this.getLogA(logger, 'last', gropeNameLimit, '', '', '');
		await this.getLogA(logger, 'hash', gropeNameLimit, 'aa2.a', '', '');
		await this.getLogA(logger, 'next', 'a', 'aa2.a', '', '');
		await this.getLogA(logger, '', '', '', '', '');
	}
	init() {
		this.setEventListern('getButton');
		this.setEventListern('nextButton');
		this.setEventListern('hashButton');
		this.setEventListern('lastButton');
		this.setEventListern('planeButton');
		this.setEventListern('postButton');
		this.setEventListern('testButton', 'click', this.doTest);
	}
	setEventListern(className, eventName = 'click', funcSeed) {
		console.log('aaa');
		const elns = document.getElementsByClassName(className);
		if (elns && elns[0]) {
			console.log('aaa');
			const target = elns[0];
			const eventListener = this.creatEventListner(target, funcSeed);
			target.addEventListener(eventName, eventListener);
		}
	}
	creatEventListner(targetElm, funcSeed) {
		const parent = targetElm.parentNode.parentNode;
		const superParent = parent.parentNode;
		const result = superParent.getElementsByClassName('result');
		const ResultDom = result && result[0] ? result[0] : null;
		const logger = new Logger(ResultDom);
		const func = funcSeed ? funcSeed(this, logger) : null;
		return async event => {
			console.log(targetElm);
			const params = {};
			for (let k = 0; k < parent.children.length; k++) {
				const childLi = parent.children[k];
				for (let i = 0; i < childLi.children.length; i++) {
					const child = childLi.children[i];
					console.log(child);
					if (child !== targetElm) {
						console.log(child.tagName);
						if (child.tagName === 'INPUT') {
							const name = child.getAttribute('name');
							const value = child.value;
							params[name] = value;
						}
					}
				}
			}
			console.log(params);
			if (func) {
				func(event);
				return;
			}
			if (params.command === 'post') {
				await this.postLog(logger, params);
			} else {
				console.log(params);
				await this.getLog(logger, params);
			}
		};
	}
	async post(params) {
		return await this.fetcher.postAsSubmit(this.url, params, true);
	}
	async get(params) {
		return await this.fetcher.getTextCors(this.url, params);
	}
	async postLog(logger, params) {
		return logger.add(await this.post(params));
	}
	async getLog(logger, params) {
		return logger.add(await this.get(params));
	}
	async postLogA(logger, command, group, fileName, hash, dataString) {
		const params = this.createData(command, group, fileName, hash, dataString);
		const result = await this.post(params);
		return logger.add('POST req:' + JSON.stringify(params) + '\n/res:' + JSON.stringify(result));
	}
	async getLogA(logger, command, group, fileName, hash, dataString, expect) {
		const params = this.createData(command, group, fileName, hash, dataString);
		const result = await this.get(params);
		console.log('getLogA result:' + result + '/!!result:' + !!result + '/' + typeof result);
		console.log(result);
		const asert = expect ? result === expect : !!result;
		return logger.add('GET req:' + JSON.stringify(params) + '\n/res:' + JSON.stringify(result) + '\n[' + asert + ']');
	}
	doTest(self, logger) {
		return event => {
			if (confirm('execute Test!' + event)) {
				self.doTestExec(event, logger);
			}
		};
	}
	createData(command, group, fileName, hash, dataString) {
		const data = {};
		if (command) {
			data.command = command;
		}
		if (group) {
			data.group = group;
		}
		if (fileName) {
			data.fileName = fileName;
		}
		if (hash) {
			data.hash = hash;
		}
		if (dataString) {
			data.data = dataString;
		}
		return data;
	}
}
class Logger {
	constructor(domObj) {
		this.domObj = domObj;
		this.domObj.style.whiteSpace = 'pre';
	}
	add(msg) {
		const current = this.domObj.textContent;
		console.log(msg);
		this.domObj.textContent = current + '\n' + msg;
		return msg;
	}
}

class UrlUtil {
	constructor() {}

	static convertObjToQueryParam(data) {
		if (data && typeof data === 'object') {
			return Object.keys(data)
				.map(key => key + '=' + encodeURIComponent(data[key]))
				.join('&');
		}
		return data;
	}
}

class Fetcher {
	constructor(headerKeys) {
		this.headerKeys = headerKeys;
	}
	async postAsSubmit(path, data, isCors = true) {
		const submitData = UrlUtil.convertObjToQueryParam(data);
		return await this.exec(path, submitData, true, 'application/x-www-form-urlencoded', isCors);
	}
	async postJsonCors(path, data) {
		return await this.post(path, data, 'application/json', true);
	}

	async post(path, data, contentType, isCors) {
		return await this.exec(path, data, true, contentType, isCors);
	}
	async exec(path, data = {}, isPost = false, contentType = 'application/json', isCORS = false) {
		const requestData = {
			method: isPost ? 'POST' : 'GET',
			mode: isCORS ? 'cors' : 'no-cors',
			cache: 'no-cache',
			credentials: 'omit',
			redirect: 'follow',
			referrer: 'no-referrer',
			headers: {
				'Content-Type': contentType
			}
		};
		const isObj = typeof data === 'object';
		if (isPost) {
			requestData.body = isObj ? JSON.stringify(data) : data;
		} else if (contentType === 'application/json') {
			const json = isObj ? JSON.stringify(data) : data;
			path += '?q=' + encodeURIComponent(json);
		} else if (isObj) {
			path += '?' + UrlUtil.convertObjToQueryParam(data);
		} else {
			path += '?q=' + encodeURIComponent(data);
		}
		console.log(path);
		console.log(requestData);
		return await fetch(path, requestData);
	}
	// async getBlob(path, data = {}, isPost = false, contentType = 'application/json', isCORS = false) {
	// 	const res = await this.exec(path, data, isPost, contentType, isCORS);
	// 	return await res.blob();
	// }
	// async getJson(path, data = {}, isPost = false, contentType = 'application/json', isCORS = false) {
	// 	const res = await this.exec(path, data, isPost, contentType, isCORS);
	// 	return await res.json();
	// }
	async getTextCors(path, data = {}, isPost = false, contentType = 'application/x-www-form-urlencoded; charset=utf-8') {
		return await this.getText(path, data, isPost, contentType, true);
	}
	async getText(path, data = {}, isPost = false, contentType = 'application/json', isCORS = false) {
		const res = await this.exec(path, data, isPost, contentType, isCORS);
		return await res.text();
	}
}

if (window) {
	const test = new Test();
	test.init();
}
