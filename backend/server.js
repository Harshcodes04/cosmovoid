const app = require("./app");
const connectDB = require("./src/config/db");
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server is running on port ${PORT} link: http://localhost:${PORT}`,
      );
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
    process.exit(1);
  });
