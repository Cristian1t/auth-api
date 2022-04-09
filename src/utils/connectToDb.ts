import config from 'config';
import mongoose from 'mongoose';
import log from './logger';

async function connectToDb() {
  const dbUri = config.get<string>('dbUri');

  try {
    await mongoose.connect(dbUri);
    log.info(`Connected to database`);
  } catch (err) {
    process.exit(1);
  }
}

export default connectToDb;