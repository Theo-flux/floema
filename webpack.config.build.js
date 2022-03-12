import path from 'path';
import {fileURLToPath} from 'url';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { merge } from 'webpack-merge';
import config from './webpack.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

module.exports = merge(config, {
	mode: 'production',

	output: {
		path: path.join(__dirname, 'public')
	},

	plugins: [
		new CleanWebpackPlugin()
	]
});

