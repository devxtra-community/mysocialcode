import app from "./app";
import dotenv from "dotenv";
dotenv.config();
import { appDataSouce } from "./data-source";
if (!process.env.PORT) {
  throw new Error("PORT is not defined in environment variables");
}

(async () => {
  try {
    await appDataSouce.initialize();
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
})();

app.listen(process.env.PORT, () => {
  console.log("server running");
});
