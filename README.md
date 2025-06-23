# Expenses
A learning/refresher project for react.  The client is developed in react with vite and uses vitest for testing.  Code coverage is good but still improving.  The server is a very simple express API.  The data is hard coded and the various calls update the list.  Restarting the server restores the data back to what it was.  The server has an artificial delay of 2 seconds on most calls to simulate network latency.

## Install
The two folders are seperate node project so once cloned you'll need to run "npm install" in both directories.  There are two scripts "run-server" and "run-client" to run from seperate terminal windows.  

The root folder contains its own package.json which has concurrently insttalled.  I'm not having any luck getting that command to run correctly.



