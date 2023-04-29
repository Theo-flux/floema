/* eslint-disable no-unused-vars */
import path from 'path';
import webpack from 'webpack';
import {fileURLToPath} from 'url';

// Plugins
import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

// const { dir } = require('console');


const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirApp = path.join(__dirname, 'app');
const dirImages = path.join(__dirname, 'images');
const dirShared = path.join(__dirname, 'shared');
const dirStyles = path.join(__dirname, 'styles');
const dirVideos = path.join(__dirname, 'videos');
const dirViews = path.join(__dirname, 'views');
const dirNode = 'node_modules';

console.log(dirApp, dirShared, dirStyles);

export default {
	entry: [
		path.join(dirApp, 'index.js'),
		path.join(dirStyles, 'index.scss')
	],
	resolve: {
		modules: [
			dirApp,
			dirImages,
			dirShared,
			dirStyles,
			dirVideos,
			dirViews,
			dirNode
		]
	},

	plugins: [
		new webpack.DefinePlugin({
			IS_DEVELOPMENT
		}),

		new CopyPlugin({
			patterns: [
				{
					from: './shared',
					to:''
				}
			]
		}),

		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css'
		}),

		new ImageMinimizerPlugin({
			minimizer: {
				implementation: ImageMinimizerPlugin.imageminMinify,
				options: {
					plugins: [
						['gifsicle', { interlaced: true }],
						['jpegtran', { progressive: true }],
						['optipng', { optimizationLevel: 5 }],
					],
				},
			},
		}),
	],

	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()],
	},

	module: {
		rules: [
			{
				test: /\.m?js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
			},

			{
				test: /\.(glsl|frag|vert)$/,
				loader: 'raw-loader',
				exclude: /node_modules/
			},

			{
				test: /\.(glsl|frag|vert)$/,
				loader: 'glslify-loader',
				exclude: /node_modules/
			},

			{
				test: /\.scss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: ''
						}
					},

					{
						loader: 'css-loader'
					},

					{
						loader:'postcss-loader'
					},

					{
						loader:'sass-loader'
					}
				]
			},

			{
				test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
				loader: 'file-loader',
				options: {
					outputPath: 'images',
					name (file) {
						return '[hash].[ext]';
					}
				}
			},

			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: [
					{
						loader: ImageMinimizerPlugin.loader,
						options: {
							minimizer: {
								implementation: ImageMinimizerPlugin.imageminMinify,
								options: {
									plugins: [
										'imagemin-gifsicle',
										'imagemin-mozjpeg',
										'imagemin-pngquant',
										'imagemin-svgo',
									],
								},
							},
						},
					},
				],
			},
		]
	}
};
