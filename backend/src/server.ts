import app from "./app";
import dotenv from 'dotenv'
dotenv.config()
if (!process.env.PORT) {
  throw new Error("PORT is not defined in environment variables");
}

app.listen(process.env.PORT,()=>{
    console.log('server running');
    
})