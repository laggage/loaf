import path from "path";
import { Configuration, Entry, EntryOptions  } from "webpack";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizer from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin'

const isProd = process.env.NODE_ENV === 'production';

/** 
 * 这里用到了webpack的[Multiple file types per entry](https://webpack.js.org/guides/entry-advanced/)特性
 * 注意`.less`入口文件必须放在`.ts`文件前 */
const entryFiles: string[] = ['./src/styles/index.less', './src/index.ts'];
const entry: Entry = {
  index: entryFiles,
  'index.min': entryFiles,
}; 

const config: Configuration = {
  entry,
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({ test: /.min.js$/ }),
      new CssMinimizer({
        test: /.min.css$/,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/env', '@babel/typescript'],
        },
      },
      {
        test: /.less$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
          },
          'postcss-loader',
          'less-loader',
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist/umd'),
    library: {
      type: 'umd',
      name: {
        amd: 'loaf',
        commonjs: 'loaf',
        root: 'loaf',
      },
    },
  },
  resolve: {
    extensions: ['.ts', '.less'],
  },
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};


export default config
