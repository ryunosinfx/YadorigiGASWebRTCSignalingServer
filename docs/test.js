class Test {
	constructor() {
		this.fetcher = new Fetcher();
		const urlInput = document.getElementById('targetUrl');
		this.url = urlInput.value;
		alert(this.url);
	}
	exec() {
		console.log('test!');
	}
	init() {
		this.setEventListern('getButton');
		this.setEventListern('nextButton');
		this.setEventListern('hashButton');
		this.setEventListern('lastButton');
		this.setEventListern('planeButton');
		this.setEventListern('postButton');
	}
	setEventListern(className, eventName = 'click') {
		console.log('aaa');
		const elns = document.getElementsByClassName(className);
		if (elns && elns[0]) {
			console.log('aaa');
			const target = elns[0];
			const eventListener = this.creatEventListner(target);
			target.addEventListener(eventName, eventListener);
		}
	}
	creatEventListner(targetElm) {
		return async event => {
			console.log(targetElm);
			const parent = targetElm.parentNode.parentNode;
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
			const superParent = parent.parentNode;
			const result = superParent.getElementsByClassName('result');
			const ResultDom = result && result[0] ? result[0] : null;
			if (params.command === 'post') {
				const result = await this.fetcher.postAsSubmit(this.url, params, true);
				ResultDom.textContent = result;
			} else {
				console.log(params);
				const result = await this.fetcher.getTextCors(this.url, params);
				ResultDom.textContent = result;
			}
		};
	}
	call() {}
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

		const myHeaders = new Headers({
			'Content-Type': contentType,
			'Content-Length': requestData.body ? requestData.body.length.toString() : '0',
			'Sec-Fetch-Dest': 'document',
			'Sec-Fetch-Mode': 'cors'
		});
		console.log(path);
		console.log(requestData);
		// requestData.headers = myHeaders;
		const res = await fetch(path, requestData);
		return res;
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
