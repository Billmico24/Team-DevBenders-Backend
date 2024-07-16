import mongoose from "mongoose";
import dotenv from "dotenv";
import { app } from "./app.js";
import open from "open";

dotenv.config();

const { DB_HOST, PORT = 3001 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running. Use our API on port: ${PORT}`)
    );

    // console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
    // swagger auto open in new tab, commit below lines to disable
    // const swaggerUiUrl = `http://localhost:${PORT}/api-docs`;
    // open(swaggerUiUrl)
    //   .then(() => {
    //     console.log(`Swagger UI opened at ${swaggerUiUrl}`);
    //   })
    //   .catch((err) => {
    //     console.error(`Failed to open Swagger UI: ${err}`);
    //   });
    // commit up to line above
    
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
