import 'source-map-support/register';
import { Glue } from 'aws-sdk';

export const handler: any = async () => {
  const { CRAWLER_NAME } = process.env;
  const request = await new Glue().startCrawler({ Name: CRAWLER_NAME }).promise();
  console.log('Crawler started !!! ', request);
  return true;
};
