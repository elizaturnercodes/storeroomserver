const app = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connection successful'));

app.listen(port, () => {
  console.log(`Stockroom listening on port ${port}`);
});
