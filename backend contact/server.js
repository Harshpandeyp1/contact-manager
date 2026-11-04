const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./Db/MongoDb");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(cors());
app.use("/api/contacts", require("./routes/ContactRoutes"));
app.use("/api/users", require("./routes/UserRoutes"));
app.use(errorHandler);
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});