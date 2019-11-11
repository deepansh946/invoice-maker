const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const pdf = require('dynamic-html-pdf');
require('dotenv').config();

const app = express();

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

// CORS Middleware
app.use((req, res, next) => {
  // Enabling CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization',
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const generateInvoice = async (req, res) => {
  try {
    const html = fs.readFileSync('invoice.html', 'utf8');

    const {data, state, ...rest} = req.body;

    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: '10mm',
    };
    const document = {
      type: 'file',
      template: html,
      context: {
        data,
        ...state,
        ...rest,
      },
      path: './output.pdf',
    };

    const result = await pdf.create(document, options);

    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: 'dlep4pzrt',
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    const uniqueFileName = new Date().toISOString();

    const {filename} = result;

    const image = await cloudinary.uploader.upload(filename, {
      public_id: `bills/${uniqueFileName}`,
      tags: 'bills',
    });

    res.send({...image});
  } catch (error) {
    throw error;
  }
};

app.post('/get-invoice', generateInvoice);

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = 8000;

app.listen(port, () => {
  console.log('Server is running at ' + port);
});
