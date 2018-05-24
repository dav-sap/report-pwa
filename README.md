My First Progressive Web App

An application to report your working status for each day.

The App is hosted on my Firebase account. The firebase server is using the `Build` folder for the `index.html` file (`.css`, `.js` etc.) it's using.

To use the app locally, just follow these simple steps:

`1. Clone the repo.
2. Run "yarn install" - to install all dependencies.
3. Run "yarn start" - the app should open on your web browser at http://localhost:4300
`

This local webserver is listening to any changes done in the `src` folder, and will refresh automatically to show the latest changes on the web.

This repo is just the Client side of the application. The requests to the server will go to the 
`SERVER_URL` const variable in the `Consts.js` and `notification-service-worker.js`.

If you wish to work on the server locally please clone the serevr repo at
https://github.com/dav-sap/StatusReporter-server

and in the `Consts.js` and `notification-service-worker.js`(if you made any changes to the notification system you should change `SERVER_URL` here as well) comment out the line of `SERVER_URL` and the localhost.

When you want to make a release you should run:

`yarn build`

and serve the `build` folder however you want.

Any question feel free to ask.

GL

