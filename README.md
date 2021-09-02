# Welcome to Serverless ETL Pipeline :D

this implementation will extract Covid 19 Data from JohnHopkinsDataUSA and NewYorkPostDataUSA, then merge the data to placed in an S3 file.

From there AWS Crawlers will run through the data files stored in S3 to be stored via Glue and will be available to viewed in charts provided by QuickSight

the goal is to reach something like this which would be super cheap to maintain:
![image](https://user-images.githubusercontent.com/4098471/131789219-a8fda3de-38a0-4c13-ad9f-93edf8d4266e.png)

This is a Serverless project example using Typescript, ready for [AWS Lambda](https://aws.amazon.com/lambda) and [API Gateway](https://aws.amazon.com/api-gateway/).
