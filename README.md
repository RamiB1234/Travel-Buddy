# Travel Buddy
![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)

## Introduction
This is an app that lets the user to enter traveling date and destination to receive weather information of the traveling date

## Live Demo

To test the last build of the app that is deployed to Heroku, click on this [link](https://npl-evaluater.herokuapp.com/)

## Installation
- Clone the repository
- Navigate to the root folder
- Run the command `npm install` to download all the required packages
- Run the command `npm start` to start the local server (port 8081)
- Run the command `npm run build-dev` to start the development environment build
- Create a new file names `.env`, add update API keys of Weather bit API and Pixbay API

## Features
- Showing destination image
- Ability to print page info
- Ability to remove travel information
- Showing how many days remaining until the flight
- Showing weather information as described below

## Weather information
- If flight is within a week, current weather information is shown
- If flight is more than a week ahead, but within 16 days, it shows forcasted weather info of that day
- If it's more than 16 days ahead, no weather info is displayed

## Technical specifications
- The project has webpack `development` and `production` envronments
- Each environment has its own loaders, plugins and configuration
- The app has 2 unit tests, one for client and one for express, to tests run `npm run test`
- The app features service workers to support offline mode

### Technology Used
- HTML
- SASS
- Vanilla Javascript
- External APIs: Geonames for getting latitude and longitude, WeatherBit for weather info and Pixbay for searching images
- Node.js/Express
- webpack with mutiple loaders and plugins
- jest library for unit testing
- Heroku for hosting the live demo

### License
The project is released under [MIT](https://github.com/RamiB1234/Travel-Buddy/blob/master/LICENSE) License