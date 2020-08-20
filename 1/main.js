/* eslint-disable no-extra-boolean-cast */
  
import { readdir, opendir, mkdir, stat, copyFile as _copyFile, existsSync, readdirSync, statSync, unlinkSync, rmdirSync } from 'fs';
import { join, parse } from 'path';


// eslint-disable-next-line no-undef
const source = process.env.SOURCE || join(__dirname, './source-folder');
// eslint-disable-next-line no-undef
const target = process.env.TARGET || join(__dirname, './target-folder');
// const deleteSource = process.env.DELETE_SOURCE === 'true';


const app = (source, target) => {
  readdir(source, (err) => {
    if (!!err) {
      console.log(`${source} not found. `, err);
      return;
    }
    
    const checkTargetFolder = (target) => {
      opendir(target, (err) => {
        // eslint-disable-next-line no-extra-boolean-cast
        if (!!err) {
          console.log(`${target} not found. Creating folder ...`);
          
          mkdir(target, (err) => {
            if (!!err) {
              console.log('Error create target folder. ', err);
              return;
            }
            console.log(`Create folder ${target}`);
          })
        }

        const moveFile = (source, target) => {
          readdir(source, (err, files) => {
            if (!!err) {
              console.log(`Source folder not found ( ${source}  )`, err);
              return;
            }

            files.forEach(file => {
              stat(join(source, file), (err, stats) => {
                if (!!err) {
                  console.log(`Error stat ${source}/${file} .`,err);
                  return;
                }
        
                if (!stats.isDirectory()) {
                  let folderName = 'Other';

                  const { name } = parse(join(source, file));
                  
                  for(let i = 0; i < name.length; i++) {
                    if ((/[a-z]|[A-Z]|[а-я]|[А-Я]/).test(name[i])) {
                      folderName = name[i].toUpperCase();
                      break;
                    }
                  }
        
                  opendir(join(target, folderName), (err) => {
                    // eslint-disable-next-line no-extra-boolean-cast
                    if (!!err) {
                      mkdir(join(target, folderName), () => {
                        copyFile(source, join(target, folderName), file);
                      })
                    } else {
                      copyFile(source, join(target, folderName), file);
                    }
                  })
                } else {
                  moveFile(join(source, file), target);
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
  _copyFile(join(oldFolder, file), join(newFolder, newFile), (err) => {
    if (!!err) {
      console.log(`Error copy file ${join(oldFolder, file)} to ${join(newFolder, newFile)}`,err);
      return;
    }
  })
}

const generateFileName = (target, fileName) => {
  const {
    name,
    ext,
  } = parse(join(target, fileName));

  if (existsSync(join(target, fileName))) {
    return generateFileName(target, `${name}_double${ext}`);
  }
  return fileName;
}

const deleteFolder = (source) => {
  if (existsSync(source)) {
    readdirSync(source).forEach(file => {
      var nextLvl = join(source, file);
        if (statSync(nextLvl).isDirectory()) {
          // eslint-disable-next-line no-unused-vars
          deleteFolder(nextLvl);
        } else {
          unlinkSync(nextLvl);
        }
      });
    rmdirSync(source);
  }
}


app(source, target);
