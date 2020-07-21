# Prerequisite

- Node.JS (>=8.0.0) is installed for develpoment
- npm is installed for development
- IBM cli is installed for deployment

# Development

- Git clone the repo
- Go to the project path
- Run **npm install** command to install all the dependencies
- Run **npm run watch** command to run the server
- It will run in http://localhost:9001 URL

# Deployment

- Open command prompt in administrative mode
- Go to project path from cli
- Run **ibmcloud login**. It will ask for IBM username and password. Type your details and press enter button.
- Run **ibmcloud target --cf** and press enter.
- Run **ibmcloud app push your-app-name** and press enter.
- Login into your IBM cloud account and go to cloud foundry application. You will find your app url from there.
- Test your application by using Postman.
