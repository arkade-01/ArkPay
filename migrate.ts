import config from "./config/config";

export default {
  uri: config.database.url,
  collection: config.database.collection,
  migrationsPath: config.database.path,

};