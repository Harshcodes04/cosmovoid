require("./src/config/env");
const app = require("./app");
const connectDB = require("./src/config/db");
const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
    process.exit(1);
  });