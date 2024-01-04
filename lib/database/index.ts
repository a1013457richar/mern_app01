import mongoose from 'mongoose';
//在serverless環境下，我們需要使用global變數來儲存連線，因為serverless會在每次執行時重啟，所以我們需要一個global變數來儲存連線，避免每次都要重新連線

const MONGODB_URI = process.env.MONGODB_URI;
//這邊先定義一個cached變數，如果已經有連線就直接回傳，沒有的話就建立一個新的連線
let cached = (global as any).mongoose || { conn: null, promise: null };
//cached serverless api global variable
//要是一個async function，因為要等待連線完成
export const connectToDatabase = async () => {
  //如果已經有連線就直接回傳
  if (cached.conn) return cached.conn;

  if(!MONGODB_URI) throw new Error('MONGODB_URI is missing');
//如果沒有連線就建立一個新的連線
  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    dbName: 'evently',
    bufferCommands: false,
  })
  //等待連線完成
  cached.conn = await cached.promise;
  // console.log(cached.conn);

  return cached.conn;
}
//server action
