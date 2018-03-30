const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const path = require('path');
const temp = require('temp');
const parseInt = require('parse-int');
const convert = require('./convert');

const appName = 'pdf2png';
const port = 3000;

app.use(fileUpload());

app.get('/', (req, res) => res.send(`Hello World from ${appName}!`));

app.post('/', function(req, res) {
    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }

    console.log(`${req.files.file.name} (${(req.files.file.data.length / 1024.0).toFixed(1)} kB)`); // the uploaded file object

    let sampleFile = req.files.file;

    temp.mkdir('pdf2png', function(err, dirPath) {
        let inputFile = path.join(dirPath, 'in.pdf');

        sampleFile.mv(inputFile, function(err) {
            if (err) {
                return res.status(500).send(err);
            }

            let options = {};

            if (req.query.dpi) {
                options.dpi = parseInt(req.query.dpi);
            }

            if (req.query.width) {
                options.width = parseInt(req.query.width);
            }

            convert.convert(inputFile, options)
                .then(
                    (destinationFile) => {
                        res.sendFile(destinationFile, {}, function() {
                            convert.convertClean(destinationFile);
                        });
                    },
                    (error) => {
                        return res.status(500).send(error);
                    }
                );
        });
    });
});

app.listen(port, () => console.log(`${appName} is listening on port ${port}`));
