require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const { HOST_DB, PORT = 3000 } = process.env;

// Set Mongoose strictQuery option
mongoose.set('strictQuery', true); // or false based on your requirement

const main = async () => {
  try {
    if (!HOST_DB) {
      throw new Error("HOST_DB not set!");
    }
    
    console.log("HOST_DB:", HOST_DB); // Log the HOST_DB variable to verify it's loaded

    await mongoose.connect(HOST_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful");
    app.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`Server is listening on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

main();
