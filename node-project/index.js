import fs from "fs";
const FilePath=process.argv[2];
//reading the file 
const content=fs.readFileSync(FilePath, "utf-8");
//splitting content
const words=content.trim().split(/\s+/);

console.log(`you have ${words.length} words in your file`);