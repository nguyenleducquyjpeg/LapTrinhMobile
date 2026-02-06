module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from', // Giúp sửa lỗi Zod
    '@babel/plugin-transform-typescript',           // Giúp sửa lỗi cú pháp "as" trong RN 0.83.1
  ],
};