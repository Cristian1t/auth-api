require('dotenv').config();
import config from 'config';
import express from 'express';
import router from './routes';
import connectToDb from './utils/connectToDb';
import log from './utils/logger';

const app = express();

// middleware
app.use(express.json());
app.use(router);

const port = config.get('port');

app.listen(port, () => {
  log.info(`Server is running on port ${port}`);

  connectToDb().then(r => r);
});