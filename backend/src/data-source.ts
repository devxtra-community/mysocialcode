import "dotenv/config";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}
export const appDataSouce = new DataSource({
    type:"postgres",
    url:process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized:false,
    },
    entities:[User],
    synchronize:true,
})