import fs from "fs";
import path from "path";

const jsonDir = path.join(__dirname, "../", "public", "json_files");
const combineJsonFile = async (message) => {
  const combinedData = [];
  const files = fs.readdirSync(path.join(jsonDir));
  files.forEach((file) => {
    try {
      const data = JSON.parse(
        fs.readFileSync(path.join(jsonDir, file), "utf-8")
      );
      combinedData.push(...data);
    } catch (err) {
      console.error(err);
    }
  });

  const uniqueData = combinedData.filter((item, index, arr) => {
    const currentItem = JSON.stringify(item);
    return (
      index === arr.findIndex((obj) => JSON.stringify(obj) === currentItem)
    );
  });

  uniqueData.forEach(function (obj) {
    obj.groupBloodNotAllowed = {
      0: obj.groupBloodNotAllowed[0],
      1: obj.groupBloodNotAllowed[1],
      2: obj.groupBloodNotAllowed[2],
      3: obj.groupBloodNotAllowed[3],
      4: obj.groupBloodNotAllowed[4],
    };
    delete obj._id;
  });

  const finalData = JSON.stringify(uniqueData, null, 2);

  try {
    fs.writeFileSync("final_data.json", finalData);
  } catch (err) {
    console.error(err);
  }
};

export default combineJsonFile;
