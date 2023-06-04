// create an express app
const express = require("express");
const app = express();

// use the express-static middleware
app.use(express.static("ACS"))
app.use(express.json())

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'content-type');

	if ('OPTIONS' === req.method) {
		res.send(200);
	}
	else {
		next();
	}
});
app.get('/check-status', (req, res) => {
	res.send("Server is running!");
});
app.post('/file-format', (req, res) => {
	res.send(run_xlsx_formatter(req.body));
});

app.get('/close-server', () => {
	process.exit(0);
});
// start the server listening for requests
app.listen(process.env.PORT || 3000,
	() => console.log("Server is running..."));


var execSync = require('child_process').execSync;

function run_xlsx_formatter(bodyy) {
	var file_upload_status = bodyy.inputFilePath;
	var child = execSync('python xlsx_formatter.py '+ bodyy.fileType + ' ' + bodyy.inputFilePath + ' output.xlsx ' + bodyy.ymn, function (error, stdout, stderr) {
		if (error != null) {
			file_upload_status = error.message;
		}
		else if (stderr != null) {
			file_upload_status = stderr.message
		}
		else {
			file_upload_status = stdout;
		}
	});
	console.log(file_upload_status);
	return file_upload_status;
}