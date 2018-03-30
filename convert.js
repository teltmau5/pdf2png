const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const rimraf = require('rimraf');
const parseInt = require('parse-int');

exports.convert = function(filepath, options) {
    options = options || {};

    return new Promise(function(resolve, reject) {
        const dirPath = path.dirname(filepath);

        let resolution = '-r 150';
        if (options.dpi) {
            const dpi = parseInt(options.dpi);
            if (dpi && dpi >= 50 && dpi <= 600) {
                resolution = `-r ${dpi}`;
            }
        }

        let widthString = '';
        if (options.width) {
            const width = parseInt(options.width);
            if (width && width >= 50 && width <= 2600) {
                widthString = `-scale-to-x ${width} -scale-to-y -1`;
            }
        }

        const basename = path.basename(filepath);
        const cmd = `pdftoppm ${basename} out -jpeg ${widthString} ${resolution} -f 1 -singlefile`;
        console.log(cmd);

        childProcess.exec(cmd, {cwd: dirPath}, (err, stdout, stderr) => {
            if (err) {
                console.log(`pdftoppm failed: ${err}`);
                convertClean(dirPath);
                reject(err);
            }

            const destinationFile = path.join(dirPath, 'out.jpg');

            resolve(destinationFile);
        });
    });
};

const convertClean = function(pathToRemove) {
    fs.lstat(pathToRemove, (err, stats) => {
        if (err) return;

        if (stats.isFile()) {
            pathToRemove = path.dirname(pathToRemove);
        }

        rimraf(pathToRemove, () => {
            console.log(`Removed ${pathToRemove}`);
        });
    });
};


exports.convertClean = convertClean;
