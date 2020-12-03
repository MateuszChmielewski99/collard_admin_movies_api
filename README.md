Main api of collard admin application. It is used to get information about movies as well as update,create and delete them. Used TypeScript, Express and Node.js. Data is strored in MongoDb. Docker is used to develop this api locally.

Some api unit test was written using Moccka and Chai. They were included in github action that runs on pr and push to main barnch. 

This repository also contains scripts to seed database with example data. It is possible to invoke them with ```yarn seedMovie``` command.

This api was deployed to aws elastick beanstalk using code pipeline and code build. 
