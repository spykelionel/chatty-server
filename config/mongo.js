import mongoose from 'mongoose';
/**
 * init database connection
 * to be called once when starting app
 * and use connection for all transactions
 * @returns {Promise<void>}
 */
const mongoConnect = async () =>{
  await mongoose.connect(process.env.MONGODB_LOCAL,{ useNewUrlParser: true, useUnifiedTopology: true });
}

export default mongoConnect;