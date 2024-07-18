import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import shortid from 'shortid';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonDir = path.join(__dirname, "../", "public", "json_files");

const combineJsonFile = async (message) => {
  try {
    const combinedData = [];
    const files = await fs.readdir(jsonDir);

    for (const file of files) {
      try {
        const data = JSON.parse(await fs.readFile(path.join(jsonDir, file), 'utf-8'));
        combinedData.push(...data);
      } catch (err) {
        console.error(`Error reading or parsing file ${file}:`, err);
      }
    }

    const uniqueData = combinedData.filter((item, index, arr) => {
      const currentItem = JSON.stringify(item);
      return index === arr.findIndex(obj => JSON.stringify(obj) === currentItem);
    });

    uniqueData.forEach(obj => {
      obj.groupBloodNotAllowed = {
        "0": obj.groupBloodNotAllowed[0],
        "1": obj.groupBloodNotAllowed[1],
        "2": obj.groupBloodNotAllowed[2],
        "3": obj.groupBloodNotAllowed[3],
        "4": obj.groupBloodNotAllowed[4]
      };
      delete obj._id; 
    });

    const finalData = JSON.stringify(uniqueData, null, 2);

    await fs.writeFile('final_data.json', finalData);

    console.log('File final_data.json written successfully.');
  } catch (err) {
    console.error('Error combining JSON files:', err);
  }
}

export { combineJsonFile };
