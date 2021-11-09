const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');
const mongoose = require('mongoose');
const File = require('./Models/file');

mongoose.connect('mongodb://127.0.0.1', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.on('error', console.log);

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'uploads');
   },
   filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const id = uuid();
      const filePath = `files/${id}${ext}`;
      File.create({ filePath }).then(() => {
         cb(null, filePath);
      });
   },
});
const upload = multer({ storage: storage });

const app = express();

app.use(express.static('public'));
app.use(express.static('uploads'));

app.post('/upload', upload.array('avatar'), (req, res) => {
   return res.redirect('/');
});

// create API endpoint

app.get('/files', (req, res) => {
   File.find().then((files) => {
      return res.json({ status: 'OK', files });
   });
});


app.listen(3000, () => {
   console.log('App is listening....');
});
