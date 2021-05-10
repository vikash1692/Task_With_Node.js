
import csv from 'csvtojson';
import { createInterface } from 'readline';
import { writeFile, createReadStream, appendFile } from 'fs';
import { join } from 'path';
import { EOL } from 'os';

const csvFilePath = join(__dirname,'../Module1/files/nodejs-hw1-ex1.csv');

const convertIntoJSON = () => {
    return new Promise((resolve, reject) => {
        csv({ ignoreEmpty: true, downstreamFormat: 'line' })
            .fromFile(csvFilePath)
            .then((jsonObj) => {
                writeFile(join(__dirname,'./JSONFile.json'), JSON.stringify(jsonObj), (err) => {
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
    try {
        const response = await convertIntoJSON();
        if (response === 200) {
            const fileStream = createReadStream(join(__dirname,'./JSONFile.json'));
            const readFile = createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            for await (const line of readFile) {
                const readData = JSON.parse(line);
                for (let data of readData) {
                    console.log(JSON.stringify(data))
                    appendFile(join(__dirname,'./OutputText.txt'), JSON.stringify(data) + EOL, (err) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                }
            }
        }
    } catch (error) {
        console.log('Error', error)
    }
}
const main = async () => {
    await writeToTextFile();
}
main();