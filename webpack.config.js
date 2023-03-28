// webpack.config.js
module.exports = {
  // 기타 설정...
  module: {
    rules: [
      {
        test: /\.js$/, // .js 파일만 적용됩니다.
        exclude: /node_modules/, // node_modules 폴더를 제외합니다.
        use: {
          loader: 'babel-loader', // Babel 로더를 사용합니다.
          options: {
            presets: ['@babel/preset-env'] // Babel 설정입니다.
          }
        }
      }
      // 기타 로더 설정...
    ]
  },
  // 기타 설정...
};
