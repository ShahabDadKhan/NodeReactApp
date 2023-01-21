import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
import multer from "multer";
// Helmet. js helps in securing express applications. It sets up various HTTP headers to prevent attacks like Cross-Site-Scripting(XSS), clickjacking, etc.
import helmet from "helmet";
// It simplifies the process of logging requests to your application.
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import register from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";

/////// configurations
// Only when you are using type module in your package.json
const __fileNname = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileNname);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "/public/assets")));

////// File Storage, used for uploading files
const storage = multer.diskStorage({
  // destination is used to determine within which folder the uploaded files should be stored.
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  // filename is used to determine what the file should be named inside the folder
  filename: function (req, file, cb) {
    cd(null, file.originalname);
  },
});
const upload = multer({ storage });

////// Routes with files
// The reason we defined this route seperatly here because we need it just after the upload method
app.post("/auth/register", upload.single("picture"), register);

// Routes
app.use("/auth", authRoutes);

/////// Mongoose Setuo
const PORT = process.env.PORT || 6001;
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`serve PORT: ${PORT}`));
  })
  .catch((error) => console.log(`${error}, did not connect`));
