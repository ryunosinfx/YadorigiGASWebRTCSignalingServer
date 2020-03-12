const regex = /[^-_\.0-9a-zA-Z]+/g;
class Recode {
	constructor(group, fileName, data, hash) {
		if (group && typeof group === 'object' && group.length > 0) {
			this.group = group[0];
			this.fileName = group[1];
			this.data = group[2];
			this.hash = group[3];
			this.createTime = group[4];
			this.index = fileName;
		} else if (!group) {
			// console.warn('Recode group!!!!!!!!!!!!!!!!' + '/');
			// console.warn(group);
		} else if (group && typeof group === 'object') {
			// console.warn('Recode group!!!!!!!!!!!!!!!!？？' + '/' + group.length);
			this.group = group.group;
			this.fileName = group.fileName;
			this.data = group.data;
			this.hash = group.hash;
			this.createTime = group.createTime;
			this.index = null;
		} else {
			this.group = group;
			this.fileName = fileName;
			this.data = data;
			this.hash = hash;
			this.createTime = Date.now();
			this.index = null;
		}
	}
	toArray() {
		return [this.group, this.fileName, this.data, this.hash, this.createTime];
	}
}
class SheetAddressor {
	constructor() {
		this.sheet = SpreadsheetApp.getActiveSpreadsheet();
		this.matrix = this.sheet.getDataRange().getValues(); //受け取ったシートのデータを二次元配列に取得
		this.rowCount = this.matrix.length;
	}
	addRow(group, fileName, data, hash) {
		const record = new Recode(group, fileName, data, hash);
		this.sheet.appendRow(record.toArray());
	}
	getLastRow() {
		let lastRowIndex = this.sheet.getDataRange().getLastRow(); //対象となるシートの最終行を取得
		return new Recode(this.matrix[lastRowIndex]);
	}
	deleteRow(index) {
		this.sheet.deleteRows(index, 1);
	}
	findRow(where) {
		console.log('Service get where');
		console.log(where);
		const current = Date.now();
		const len = this.matrix.length;
		const whereCount = where.length;
		const scavengableList = [];
		let resultRow = null;
		let resultRowIndex = -1;
		for (let i = len - 1; i > -1; i--) {
			//SearchFromeEnd
			const row = this.matrix[i];
			const colsCount = row.length;
			const matchCount = 0;
			for (let j = 0; j < colsCount; j++) {
				const colValue = row[j];
				const condition = where[j];
				console.log('SheetAddressor colValue:' + colValue + '/condition:' + condition + '/matchCount:' + matchCount + '/whereCount:' + whereCount + '/j:' + j);
				if ((whereCount > j && condition && condition === colValue) || (whereCount > j && !condition)) {
					matchCount++;
				}
			}
			if (matchCount === whereCount) {
				console.log('SheetAddressor findRow row' + typeof row + '/' + Array.isArray(row));
				console.log(row);
				resultRow = row;
				resultRowIndex = i;
			}
			const createTime = (row[4] + '') * 1;
			if (!isNaN(createTime) && createTime < current) {
				console.log('createTime:' + createTime + '/i:' + i);
				scavengableList.push(i);
			}
		}
		const scvlen = scavengableList.length;
		for (let i = 0; i < scvlen; i++) {
			const index = scavengableList.pop() + 1;
			console.log('index:' + index + '/i:' + i);
			this.deleteRow(index);
		}
		if (resultRow) {
			return new Recode(resultRow, resultRowIndex);
		}
		console.log('SheetAddressor Not findRow row');
		return null;
	}
	getRowByIndex(index) {
		if ((index !== 0 && index < 0) || index >= this.rowCount) {
			return null;
		}
		return new Recode(this.matrix[index]);
	}
}
class Service {
	constructor() {
		this.accessor = new SheetAddressor();
	}
	getLatest() {
		return this.accessor.getLastRow();
	}
	getNext(group, fileName) {
		const result = this.accessor.findRow([group, fileName]);
		const index = result ? result.index : null;
		const targetIndex = index && typeof index === 'number' ? index - 1 : 0;
		// console.log('Service getNext' + targetIndex);
		// console.log(targetIndex);
		return this.accessor.getRowByIndex(targetIndex);
	}
	get(group, fileName) {
		console.log('Service get fileName');
		console.log(fileName);
		return this.accessor.findRow([group, fileName]);
	}
	save(group, fileName, data, hash) {
		// console.log('Service save +' + { group, fileName, data, hash });
		// console.log('Service save');
		if (!group || !fileName || !data || !hash) {
			return;
		}
		this.accessor.addRow(this.reap(group, 128), this.reap(fileName, 128), this.reap(data, 10240), this.reap(hash, 90));
	}
	reap(value, max) {
		return (value + '')
			.split(regex)
			.join('')
			.substring(0, max);
	}
}

class YadorigiWebRTCSignalingServer {
	constructor() {
		this.name = 'YadorigiWebRTCSignalingServer';
		this.service = new Service();
	}
	doPost(event) {
		if (!event || !event.parameter) {
			return ContentService.createTextOutput(JSON.stringify(event));
		}
		const group = event.parameter.group;
		const fileName = event.parameter.fileName;
		const data = event.parameter.data;
		const hash = event.parameter.hash;
		// console.log('ServerClass save +' + JSON.stringify(event.parameter));
		if (group && fileName && data && hash) {
			this.service.save(group, fileName, data, hash);
		}
		const output = ContentService.createTextOutput('');
		output.append(hash);
		output.setMimeType(ContentService.MimeType.TEXT);
	}
	doGet(event) {
		if (!event || !event.parameter) {
			return ContentService.createTextOutput(JSON.stringify(event));
		}
		const param = event.parameter;
		const command = param ? param.command : null;
		const fileName = param ? param.fileName : null;
		const group = param ? param.group : null;
		console.log('ServerClass doGet +' + JSON.stringify(event));
		console.log(event.parameter);
		console.log(event);
		if (command && group) {
			switch (command) {
				case 'get':
					console.log('command:' + command);
					return this.res(this.service.get(group, fileName), 'data');
				case 'next':
					console.log('command:' + command);
					return this.res(this.service.getNext(group, fileName), 'data');
				case 'hash':
					console.log('command:' + command);
					return this.res(this.service.getNext(group, fileName), 'hash');
				case 'last':
					console.log('command:' + command);
					return this.res(this.service.getLatest(group), 'data');
				default:
					console.log('Sorry, we are out of ' + command + '.');
			}
			return;
		}
		const output = ContentService.createTextOutput('');
		output.append('');
		output.setMimeType(ContentService.MimeType.TEXT);
	}
	res(record, key) {
		const output = ContentService.createTextOutput('');
		output.append(record && record[key] && record[key] !== 0 ? record[key] : '');
		output.setMimeType(ContentService.MimeType.TEXT);
		return output;
	}
}
const server = new YadorigiWebRTCSignalingServer();

function doPost(event) {
	try {
		return server.doPost(event);
	} catch (e) {
		console.warn(e);
		return ContentService.createTextOutput(e + '');
	}
}
function doGet(event) {
	try {
		return server.doGet(event ? event : { parameter: { command: 'get', group: 'a', fileName: 'aaa' } });
	} catch (e) {
		console.warn(e);
		return ContentService.createTextOutput(e + '');
	}
}
