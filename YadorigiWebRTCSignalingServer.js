///
///API一覧
// ・画像投稿
// ・画像取得
// ・最終更新ハッシュ取得
// ・次の画像取得

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
	constructor(sheet) {
		this.sheet = sheet;
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
		const len = this.matrix.length;
		const whereCount = where.length;
		for (let i = len - 1; i > -1; i--) {
			//SearchFromeEnd
			const row = this.matrix[i];
			const colsCount = row.length;
			const matchCount = 0;
			for (let j = 0; j < colsCount; j++) {
				const colValue = row[j];
				const condition = where[j];
				// console.log('SheetAddressor colValue:' + colValue + '/condition:' + condition + '/matchCount:' + matchCount + '/whereCount:' + whereCount + '/j:' + j);
				if ((whereCount > j && condition && condition === colValue) || (whereCount > j && !condition)) {
					matchCount++;
				}
			}
			if (matchCount === whereCount) {
				// console.log('SheetAddressor findRow row' + typeof row + '/' + Array.isArray(row));
				// console.log(row);
				return new Recode(row, i);
			}
		}
		// console.log('SheetAddressor Not findRow row');
		return null;
	}
	getRowByIndex(index) {
		if ((index !== 0 && index < 0) || index >= this.rowCount) {
			return null;
		}
		return new Recode(this.matrix[lastRowIndex]);
	}
}
class Service {
	constructor() {
		this.spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
		this.accessor = new SheetAddressor(this.spreadsheet);
	}
	getLatest() {
		// console.log('Service getLatest');
		return this.accessor.getLastRow();
	}
	getNext(group, fileName) {
		const where = [group, fileName];
		const result = this.accessor.findRow(where);
		const index = result ? result.index : null;
		const targetIndex = index && typeof index === 'number' ? index - 1 : 0;
		// console.log('Service getNext' + targetIndex);
		// console.log(targetIndex);
		return this.accessor.getRowByIndex();
	}
	get(group, fileName) {
		const where = [group, fileName];
		// console.log('Service get where');
		// console.log(where);
		return this.accessor.findRow(where);
	}
	save(group, fileName, data, hash) {
		// console.log('Service save +' + { group, fileName, data, hash });
		// console.log('Service save');
		if (!group || !fileName || !data || !hash) {
			return;
		}
		this.accessor.addRow(group, fileName, data, hash);
	}
}

class YadorigiWebRTCSignalingServer {
	constructor(hoge) {
		this.name = 'YadorigiWebRTCSignalingServer';
		this.service = new Service();
	}
	doPost(event) {
		let group = event.parameter.group;
		let fileName = event.parameter.fileName;
		let data = event.parameter.data;
		let hash = event.parameter.hash;
		// console.log('ServerClass save +' + JSON.stringify(event.parameter));
		if (group && fileName && data && hash) {
			this.service.save(group, fileName, data, hash);
		}
		let output = ContentService.createTextOutput('');
		output.append(hash);
		output.setMimeType(ContentService.MimeType.TEXT);
	}
	doGet(event) {
		let param = event.parameter;
		let command = param ? param.command : null;
		let fileName = param ? param.fileName : null;
		let group = param ? param.group : null;
		let output = ContentService.createTextOutput('');
		// console.log('ServerClass doGet +' + JSON.stringify(event));
		// console.log(event.parameter);
		// console.log(event);
		if (command && group) {
			switch (command) {
				case 'get':
					let record0 = this.service.get(group, fileName);
					// console.log('ServerClass doGet get record0:' + record0);
					// console.log(record0);
					output.append(record0.data);
					output.setMimeType(ContentService.MimeType.TEXT);
					break;
				case 'next':
					let record1 = this.service.getNext(group, fileName);
					// console.log('ServerClass doGet next record1:' + record1);
					// console.log(record1);
					output.append(record1.data);
					output.setMimeType(ContentService.MimeType.TEXT);
					break;
				case 'hash':
					let record3 = this.service.getNext(group, fileName);
					// console.log('ServerClass doGet hash record3:' + record3);
					// console.log(record3);
					output.append(record3.hash);
					output.setMimeType(ContentService.MimeType.TEXT);
					break;
				case 'last':
					let record2 = this.service.getLatest(group);
					// console.log('ServerClass doGet last record2:' + record2);
					// console.log(record2);
					output.append(record2 ? record2.data : '');
					output.setMimeType(ContentService.MimeType.TEXT);
					break;
				default:
					console.log('Sorry, we are out of ' + command + '.');
			}
			return;
		}
		output.append('');
		output.setMimeType(ContentService.MimeType.TEXT);
	}
}

function create(hoge) {
	return new YadorigiWebRTCSignalingServer(hoge);
}

function doPost(event) {
	const server = new YadorigiWebRTCSignalingServer();
	return server.doPost(event);
}
function doGet(event) {
	let server = new YadorigiWebRTCSignalingServer();
	return server.doGet(event);
}
