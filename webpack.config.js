const pkg = require('./package.json');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

buildRelease = (env) =>{
  return {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: env === 'prod' ? `multiDial-${pkg.version}.min.js` : `multiDial-${pkg.version}.js`, 
      //expose library
      library: 'MultiDial',
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.js'],
      modules: [path.resolve(__dirname, 'src')],
    },
    devtool: 'source-map',
    optimization: {
      minimize: env === 'prod' ? true : false
    },    

  }
}

/*
buildNPM = () =>{
  return {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js', 
      //expose library
      library: 'MultiDial',
      libraryTarget: 'commonjs2',
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
      ],
    },
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    }
  }
}
*/



module.exports = (env) => {
  switch (env) {
    case 'prod':
      return [buildRelease(env), buildRelease('dev')];
    default:
      return [buildRelease(env)];
  }
};



