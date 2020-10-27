require('dotenv').config();

module.exports = {
  uid: process.env.RADICHU_UID,
  searchEndpoint: process.env.RADICHU_SEARCH_ENDPOINT,
  streamEndpoint: process.env.RADICHU_STREAM_ENDPOINT,
  streamToken: process.env.RADICHU_STREAM_TOKEN,
  storagePath: process.env.RADICHU_STORAGE_PATH,
};
