
const csv = require('csvtojson');
const read = require('readline');
const fs = require('fs');
const path = require('path');
const csvFilePath = path.join(__dirname, '../files/nodejs-hw1-ex1.csv');
const os = require('os');

const convertIntoJSON = () => {
    return new Promise((resolve, reject) => {
        csv({ignoreEmpty:true,downstreamFormat:'line'})
            .fromFile(csvFilePath)
            .then((jsonObj) => {
                fs.writeFile(path.join(__dirname, '../files/JsonFile.json'), JSON.stringify(jsonObj), (err) => {
                    if (err) {
                        reject(403)
                    }
                    resolve(200)
                })
            })
            .catch(() => {
                reject(403)
            })
    })
}

const writeToTextFile = async () => {
    const response = await convertIntoJSON();
    if (response === 200) {
        const fileStream = fs.createReadStream(path.join(__dirname, '../files/JsonFile.json'));
        const readFile = read.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of readFile) {
            const jsonData = JSON.parse(line);
            for( data of jsonData) {
                console.log(JSON.stringify(data))
                fs.appendFile(path.join(__dirname, '../files/ConvertedOutput.txt'), JSON.stringify(data) + os.EOL, (err) => {
                if (err) {
                    console.log(err)
                }
                })
            }
        }
    }
}
const main = async () => {
    await writeToTextFile();
}
main();