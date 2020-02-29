const path = require('path');

module.exports = {
	devServer: {
		contentBase: path.join(__dirname, 'docs'),
		compress: true,
		port: 9001,
		inline: true
	}
};
