module.exports = {
  presets: ['module:@react-native/babel-preset'],

  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          assets: './assets',  // 루트 디렉토리의 assets 폴더를 alias로 설정
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
};
