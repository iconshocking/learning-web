import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import process from "process";

// __dirname and __filename are not available in ES6 module
const __dirname = path.resolve();
const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // for maximum safety, should ideally send file somewhere else that's isolated/sandboxed, for security
    if (!fs.existsSync(__dirname + "/form-uploads")) {
      fs.mkdirSync(__dirname + "/form-uploads");
    }
    cb(null, __dirname + "/form-uploads");
  },
  // ideally would like to be able to set file to not have execute permission
  filename: function (req, file, cb) {
    const separator = file.originalname.lastIndexOf(".");
    const [origName, fileExt] = file.originalname.split(".");
    // do NOT trust use provided file extensions, validate them yourselves
    cb(
      null,
      file.fieldname +
        "-" +
        file.originalname.substring(0, separator) +
        "." +
        file.originalname.substring(separator + 1)
    );
  },
});
const upload = multer({
  storage: storage,
  // limit data send to avoid receiving something we aren't expecting
  limits: { fileSize: 10_000_000, fieldSize: 100, fields: 2, files: 1 },
});

// express now comes bundled with its own body parser
app.use(express.urlencoded({ extended: true }));

app.get("/form-sending", (req, res) => {
  res.sendFile(__dirname + "/form-sending.html");
});

const PORT = process.env.PORT ?? 5500;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

app.post("/form-sending", (req, res) => {
  const { name, last } = req.body;
  res.send(`Thanks ${name} ${last}!`);
});

// not sure if express needs sanitization
app.post("/form-sending/file-upload", upload.single("file"), (req, res) => {
  const { name, last } = req.body;
  res.send({ resp: `Thanks ${name} ${last}!` });
});
