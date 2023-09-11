const { MongoClient } = require('mongodb');
const mongoURI = 'mongodb+srv://Daniel:DMS1997@atlascluster.by0nbvr.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'Junkyard';
const PORT = 5000;


module.exports = async function startServer(app, port) {
  try {
    const client = await MongoClient.connect(mongoURI, { useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    const db = client.db(dbName);

    require('./routes')(app, db);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};
