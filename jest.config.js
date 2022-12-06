// Sync object
const config = {
  verbose: true,
  transform: {
    "^.+\\.jsx?$": "babel-jest", // Adding this line solved the issue
    "^.+\\.tsx?$": "ts-jest",
  },
};

module.exports = config;
