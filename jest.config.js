module.exports = {
  preset: 'ts-jest',
  verbose: false,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleDirectories: ['node_modules', 'src'],
  setupFiles: ['./src/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  testPathIgnorePatterns: ['dist', '/build/', '/node_modules/'],
  globals: {
    'ts-jest': {
      packageJson: 'package.json',
    },
  },
};
