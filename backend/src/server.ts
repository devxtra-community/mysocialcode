import app from "./app";
import dotenv from 'dotenv';
dotenv.config()
import { pool } from "./config/db";
if (!process.env.PORT) {
  throw new Error("PORT is not defined in environment variables");
}

(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed");
    process.exit(1);
  }
})();


app.listen(process.env.PORT,()=>{
    console.log('server running');
    
})