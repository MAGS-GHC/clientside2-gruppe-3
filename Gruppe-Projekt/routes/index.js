module.exports = (app, db) => {
    require('./users')(app, db);
  };