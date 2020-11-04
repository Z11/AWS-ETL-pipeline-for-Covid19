import 'source-map-support/register';
import fetch from 'node-fetch';
import { Readable } from 'stream';
import { S3 } from 'aws-sdk';
import * as intoStream from 'into-stream';

async function getDataTextArray(url: string): Promise<string[][]> {
  const fileBuffer = await fetch(url);
  const dataText: string = await fileBuffer.text();
  return dataText.split('\n').map((x) => x.split(','));
}

async function mergeCovidData(jhData: string[][], nypData: string[][]): Promise<string[][]> {
  return nypData
    .map(function (nypRow: string[]): string[] {
      const matchingRow: string[] = jhData.find((jhRow) => jhRow[0] === nypRow[0]); // compare dates
      return matchingRow ? [...nypRow, matchingRow[4]] : null; //append recovery data if match exists
    })
    .filter(Boolean); // remove rows with no recovery data (null rows);
}

async function createStreamFromData(dataset: string[][]): Promise<Readable> {
  const text: string = dataset.join('\n');
  return intoStream(text);
}

async function uploadFileToS3(
  bucketName: string,
  folderName: string,
  fileName: string,
  dataStream: Readable,
): Promise<void> {
  await new S3().upload({ Bucket: bucketName, Key: `${folderName}/${fileName}`, Body: dataStream }).promise();
}

export const handler: any = async () => {
  const { NEWYORKPOST_URL, JOHNHOPKINS_URL, COVIDBucketName, COVIDFolderName, COVIDFileName } = process.env;
  const NewYorkPostDataUSA: string[][] = await getDataTextArray(NEWYORKPOST_URL);
  const JohnHopkinsDataUSA: string[][] = (await getDataTextArray(JOHNHOPKINS_URL)).filter((row) => row[1] === 'US');
  const header: string[] = NewYorkPostDataUSA.shift(); //remove header but save it for later
  const newDataSet: string[][] = await mergeCovidData(JohnHopkinsDataUSA, NewYorkPostDataUSA);
  newDataSet.unshift([...header, 'recovery']); //add back in header with new column name
  const dataStream: Readable = await createStreamFromData(newDataSet);
  await uploadFileToS3(COVIDBucketName, COVIDFolderName, COVIDFileName, dataStream);
  console.log('Data Extraction Complete !!!');
  return true;
};
