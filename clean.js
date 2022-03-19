import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directoryPath = path.join(__dirname, 'public');

function clean(){
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file);
        const deleteThis = `${directoryPath}/${file}`
        fs.stat(deleteThis, (err, stats) => {
          if(err){
            console.log(err)
          }else{
            if(stats.isFile()){
              fs.unlink(deleteThis, (err) => {
                if(err){
                  console.log(err)
                  // console.log(`Error deleting file ${file}`)
                }
              })
            }else if(stats.isDirectory()){
              fs.rm(deleteThis, {recursive: true, false:true}, (err) => {
                if(err){
                  console.log(err)
                  // console.log(`Error deleting folder ${file}`)
                }
              })
            }
          }
        })
    });
  });

}

clean()
