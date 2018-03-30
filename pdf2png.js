const express = require('express')
const app = express()
const fileUpload = require('express-fileupload');

const path = require('path');
const temp = require('temp');
const rimraf = require('rimraf');
const parseInt = require('parse-int');


const { exec } = require('child_process');



app.get('/', (req, res) => res.send('Hello World!'))
app.use(fileUpload())


app.post('/', function(req, res) {

if (!req.files)
    return res.status(400).send('No files were uploaded.');

	console.log(req.files.file); // the uploaded file object

	let sampleFile = req.files.file;


	temp.mkdir('pdf2png', function(err, dirPath) {
	var inputFile = path.join(dirPath, "in.pdf");

	
		console.log(dirPath);
	// Use the mv() method to place the file somewhere on your server
	sampleFile.mv(inputFile, function(err) {
	if (err)
		return res.status(500).send(err);
	
	var resolution = '-r 150';
	
	if(req.query.dpi) {
		var dpi = parseInt(req.query.dpi);
		if(dpi && dpi >= 50 && dpi <= 600)
		{
			resolution = '-r ' + dpi;
		}
	}
	var widthString = '';
	
	if(req.query.width) {
		var width = parseInt(req.query.width);
		if(width && width >= 50 && width <= 2600)
		{
			widthString = '-scale-to-x ' + width + ' -scale-to-y -1';
		}
	}
	
	
	
	
	exec('pdftoppm in.pdf out -png ' + widthString + ' ' + resolution + ' -f 1 -singlefile', {cwd: dirPath}, (err, stdout, stderr) => {
		  if (err) 
			  return res.status(500).send(err)
		 
			      // node couldn't execute the command
			  //     return;
			  //       }
     	res.sendFile(path.join(dirPath, 'out.png'), {}, function() {
	rimraf(dirPath, () => {
		console.log("Removed temp directory");
	});	
	}); 
	});
	});
	});

});

 app.listen(3000, () => console.log('Example app listening on port 3000!'))
