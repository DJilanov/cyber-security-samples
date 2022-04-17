
var AdmZip = require("adm-zip");
var path = require('path');

// reading archives
var zip = new AdmZip("./my_file.zip");
var zipEntries = zip.getEntries(); // an array of ZipEntry records
console.log('Entries: ', zipEntries.map((el) => el.name));
zip.extractAllTo(path.join(__dirname, '/folder/'), true);