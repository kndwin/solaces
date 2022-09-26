/* eslint-disable */
export default {
  displayName: 'features-wysiwyg-editor',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/features/wysiwyg-editor',
};
