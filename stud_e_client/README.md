
## Client side codebase of stud-E application

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.0.

## Prerequisites

Angular requires Node.js version 10.9.0 or later. You can download it from https://nodejs.org/en/. 
Once you have installed Node.js on your system, open node.js command prompt. To check your version, run node -v in a terminal/console window. After downloading Node.js, the node package manager (npm) should automatically be installed. Test it out by doing: [`npm --version`]

Use the following command to install Angular CLI
[`npm install -g @angular/cli`]
To check Node and Angular CLI version, use `ng --version` command.


## Clone this project from GIT

`git clone (copy git url and paste)`

## Run `npm i` to install node mudules

## Development server

Run `ng serve` for a local server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Deployment steps
	Build your angular project into production mode.
`ng build –prod`
	Go to your build folder and create two files. 1. `manifest.yml` 2. `Staticfile.txt`.
	Open `manifest.yml`. Paste below piece of code and save.

`---`
`applications`
`-   name: chattalk-client`
    `memory: 256M`
    `disk_quota: 512M`
    `instances: 1`
    `buildpack: staticfile_buildpack`

	Keep `Staticfile.txt` as a blank file.
	Open command prompt in administrative mode. [Make sure `IBM cli` is installed in your system].
	Go to desired build path from cli.
	Run `ibmcloud login`. It will ask for your IBM username and password. Type your details and press enter button.
	Run `ibmcloud target --cf` and press enter.
	Run `ibmcloud app push your-app-name` and press enter.
	Login into your IBM cloud account and go to cloud foundry application. You will find your app url from there [`visit app url`].
	Check your application in browser.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).