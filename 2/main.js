const yargs = require('yargs')
const fs = require ('fs');
const path = require ('path');

const args = yargs
  .usage('Usage: $0 [options]')
  .help('help')
  .alias('help', 'h')
  .version('0.0.1')
  .alias('version', 'v')
  .options('entry', {
    alias: 'e',
    describe: 'Source folder',
    demandOption: true,
  })
  .options('dist', {
    alias: 'd',
    description: 'Target folder',
    default: './2/dist',
  })
  .options('delete', {
    alias: 'd',
    description: 'Delete source folder',
    dafault: false,
    boolean: true,
  })
  .epilog('Homework 2/2')
  .argv;

const app = async (entry, target) => {
  await fs.readdirSync(entry);
  await checkTargetFolder(target);
  await moveFile (entry, target);
  console.log('DONE')
}


const checkTargetFolder = async (target) => {
  try {
    await fs.readdirSync(target);
  } catch (error) {
    // тут по хорошему надо сделать разбор ошибки, что бы создать папку или кинуть эксепшен
    await fs.mkdirSync(target)
  }
}

const moveFile = async (entry, target) => {
  const files = fs.readdirSync(entry);

  files.forEach(async file => {
    const stats = await fs.statSync(path.join(entry, file))
    if (!stats.isDirectory()) {
      let folderName = 'Other';

      const { name } = path.parse(path.join(entry, file));
      
      for(let i = 0; i < name.length; i++) {
        if ((/[a-z]|[A-Z]|[а-я]|[А-Я]/).test(name[i])) {
          folderName = name[i].toUpperCase();
          break;
        }
      }

      try {
        await fs.opendirSync(path.join(target, folderName));
      } catch (err) {
        await fs.mkdirSync(path.join(target, folderName))
      }

      copyFile(entry, path.join(target, folderName), file);

    } else {
      moveFile(path.join(entry, file), target);
    }
  })
}

const copyFile = async (oldFolder, newFolder, file) => {
  const newFile = generateFileName(newFolder, file);
  await fs.copyFileSync(path.join(oldFolder, file), path.join(newFolder, newFile));
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

app(args.entry, args.dist);
