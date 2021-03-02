const fs = require("fs");
const readline = require("readline");
const path1 = "dir/test1.html";
const path2 = "dir/test2.html";
const path3 = "dir/test3.html";
const path4 = "dir/test4.html";
const path5 = "dir/text.txt";
//***** Check File Exist or not Exist *****
function checkfile(file) {
  fs.access(file, fs.constants.F_OK, (err) => {
    console.log(`${file} ${err ? "does not exist \n" : "exists \n"}`);
  });
}
checkfile(path1);
checkfile(path2);

//***** Giving Read Permission *****
function ReadPermission(file) {
  fs.chmodSync(file, 0o444);
  console.log(`${file} given readable Permission \n`);
}
ReadPermission(path1);
//***** Giving Write Permission *****
function WritePermission(file) {
  fs.chmodSync(file, 0o422);
  console.log(`${file} given Write Permission \n`);
}
WritePermission(path3);

//***** Giving Execute Permission *****
function ExecutePermission(file) {
  fs.chmodSync(file, 0o411);
  console.log(`${file} given Execute Permission \n`);
}
ExecutePermission(path4);

//***** Check File is readable or Not *****
function fileReadable(file) {
  fs.access(file, fs.constants.R_OK, (err) => {
    console.log(`${file} ${err ? "is not readable \n" : "is readable \n"}`);
  });
}
fileReadable(path1);
fileReadable(path3);
fileReadable(path4);

//("***** Check File is writable or Not *****
function fileWritable(file) {
  fs.access(file, fs.constants.W_OK, (err) => {
    console.log(`${file} ${err ? "is not writable \n" : "is writable \n"}`);
  });
}
fileWritable(path1);
fileWritable(path3);
fileWritable(path4);

//("***** Check File can Exeute or not *****
function fileExecute(file) {
  fs.access(file, fs.constants.X_OK, (err) => {
    console.log(`${file} ${err ? "cannot execute \n" : "Can Execute \n"}`);
  });
}
fileExecute(path1);
fileExecute(path3);
fileExecute(path4);

//("***** Determining the line count of a text file *****

function NoOfLine(file) {
  var linesCount = 0;
  var rl = readline.createInterface({
    input: fs.createReadStream(file),
    output: process.stdout,
    terminal: false,
  });
  rl.on("line", function (line) {
    linesCount++; // on each linebreak, add +1 to 'linesCount'
  });
  rl.on("close", function () {
    console.log(`${path5} no. of lines ${linesCount}`); // print the result when the 'close' event is called
  });
}
NoOfLine(path5);

//("***** Reading a file line by line *****

function ReadLine(file) {
  
  var rl = readline.createInterface({
    input: fs.createReadStream(file),
    output: process.stdout,
    terminal: false,
  });
  rl.on("line", function (line) {
      console.log(line); 
  });
  
}
ReadLine(path5);