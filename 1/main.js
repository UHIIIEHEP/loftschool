/* eslint-disable no-extra-boolean-cast */
  
// import { readdir, opendir, mkdir, stat, copyFile as _copyFile, existsSync, readdirSync, statSync, unlinkSync, rmdirSync } from 'fs';
// import { join, parse } from 'path';

  
const fs = require ('fs');
const path = require ('path');


// eslint-disable-next-line no-undef
const source = process.env.SOURCE || path.join(__dirname, './source-folder');
// eslint-disable-next-line no-undef
const target = process.env.TARGET || path.join(__dirname, './target-folder');
// const deleteSource = process.env.DELETE_SOURCE === 'true';


const app = (source, target) => {
  fs.readdir(source, (err) => {
    if (!!err) {
      console.log(`${source} not found. `, err);
      return;
    }
    
    const checkTargetFolder = (target) => {
      fs.opendir(target, (err) => {
        // eslint-disable-next-line no-extra-boolean-cast
        if (!!err) {
          console.log(`${target} not found. Creating folder ...`);
          
          fs.mkdir(target, (err) => {
            if (!!err) {
              console.log('Error create target folder. ', err);
              return;
            }
            console.log(`Create folder ${target}`);
          })
        }

        const moveFile = (source, target) => {
          fs.readdir(source, (err, files) => {
            if (!!err) {
              console.log(`Source folder not found ( ${source}  )`, err);
              return;
            }

            files.forEach(file => {
              fs.stat(path.join(source, file), (err, stats) => {
                if (!!err) {
                  console.log(`Error stat ${source}/${file} .`,err);
                  return;
                }
        
                if (!stats.isDirectory()) {
                  let folderName = 'Other';

                  const { name } = path.parse(path.join(source, file));
                  
                  for(let i = 0; i < name.length; i++) {
                    if ((/[a-z]|[A-Z]|[а-я]|[А-Я]/).test(name[i])) {
                      folderName = name[i].toUpperCase();
                      break;
                    }
                  }
        
                  fs.opendir(path.join(target, folderName), (err) => {
                    // eslint-disable-next-line no-extra-boolean-cast
                    if (!!err) {
                      fs.mkdir(path.join(target, folderName), () => {
                        copyFile(source, path.join(target, folderName), file);
                      })
                    } else {
                      copyFile(source, path.join(target, folderName), file);
                    }
                  })
                } else {
                  moveFile(path.join(source, file), target);
                }
              });
            });
          });
        }
        moveFile(source, target);
      }); 
    };

    checkTargetFolder(target);
  })
}

const copyFile = (oldFolder, newFolder, file) => {
  const newFile = generateFileName(newFolder, file);
  fs.copyFile(path.join(oldFolder, file), path.join(newFolder, newFile), (err) => {
    if (!!err) {
      console.log(`Error copy file ${path.join(oldFolder, file)} to ${path.join(newFolder, newFile)}`,err);
      return;
    }
  })
}

const generateFileName = (target, fileName) => {
  const {
    name,
    ext,
  } = path.parse(path.join(target, fileName));

  if (fs.existsSync(path.join(target, fileName))) {
    return generateFileName(target, `${name}_double${ext}`);
  }
  return fileName;
}

const deleteFolder = (source) => {
  if (fs.existsSync(source)) {
    fs.readdirSync(source).forEach(file => {
      var nextLvl = path.join(source, file);
        if (fs.statSync(nextLvl).isDirectory()) {
          // eslint-disable-next-line no-unused-vars
          deleteFolder(nextLvl);
        } else {
          fs.unlinkSync(nextLvl);
        }
      });
      fs.rmdirSync(source);
  }
}


app(source, target);
