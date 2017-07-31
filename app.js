//Rally Web Data Connector
//Trey Brunson

/*
app.js is the main server file that all requests to the server are routed through
*/
//--------------Required Libraries---------------//
//Web development framwork  
var express = require('express');
//Setting paths to find files
var path = require('path');
//Handling data from post requests
var bodyParser = require('body-parser');
//Creating sessions to share variables across application
var session = require('express-session');
//Easy HTTP requests
var request = require('request');
//--------------Required Libraries---------------//

///-------------Router Paths--------------///
var getWorkspaces = require('./routes/getWorkspaces');
var getProjects = require('./routes/getProjects');
var getTableauData = require('./routes/getTableauData');
///--------------Router Paths---------------///

//Create an instance of the application
var app = express();

//--------------Setting Paths for Files---------------//
// Set path to look for views where all our ejs files are located
app.set('views', path.join(__dirname, 'views'));
//Use ejs to create dynamic web pages
app.set('view engine', 'ejs');
//Set path for static files
app.use(express.static(path.join(__dirname, 'public')));
//--------------Setting Paths for Files---------------//

//--------------Defining requirments for current app instance---------------//
//Create a session for this instance to pass variables between routes
app.use(session({
  cookieName: 'session',
  secret: 'Keep this hidden',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

//Allow cross site requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Handel data from POST request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//--------------Defining Requirments for current app instance---------------//

//--------------OAUTH---------------//
//Get configuration info for oAuth
/*
-First we require out config.js file where we inputed all the configuration information about our web data connector rally oauth setup
-we create all the variables needed to create requests to rally to retreive the OAUTH token
*/

//Require the config file
var config =require('./config.js');

//Defining Variables for OAuth
var clientID = config.CLIENT_ID;
var clientSecret = config.CLIENT_SECRET;
console.log("Client ID: ", clientID);
console.log("Client Secret: ", clientSecret);

//Building the redirect URI 
var redirectURI = config.HOSTPATH + ":" + config.PORT + config.REDIRECT_PATH;

//Handel redirect request from rally oAuth request
/*
-When the connectbutton is pressed on the index.html page the user is redirected to the rally oauth page 
-rally authenticates the user and redirects them to the redirect route we defined during out intial setup
-the redirect route calls a function that sends a post request to url: 'https://rally1.rallydev.com/login/oauth2/token',
-to request the oauth token to be used in all our queries to rally about our user
-after the token is retrieved the user is redirected to the getWorkspaces route 
*/
app.get('/redirect', function(req, res) { //This is the same as your call back url from oauth setup localhost:3000 /redirect
    console.log("Redirect request called");
    //Define a session
    var ssn;
    ssn = req.session;
    
  //Get authorization code from rally where it was saved in the request object by rally
  authCode = req.query.code;
    
  //Print authoCode to console 
  console.log("Auth Code: ", authCode);
    
  //Request for access token now that we have a code
  /*
  -Now we build the post request that we send to rally to retreive the OAuth token to be used to all of our API requests
*/   
  var requestObject = {
      code: authCode,
      redirect_uri: redirectURI,
      grant_type: 'authorization_code',
      client_id: clientID,
      client_secret: clientSecret,
  };
  var token_request_header = {
      'Content-Type': 'application/x-www-form-urlencoded',
  };
  var options = {
      method: 'POST',
      url: 'https://rally1.rallydev.com/login/oauth2/token',
      jar: false,
      form: requestObject,
      headers: token_request_header,
  };
    
  //Make the post request
  request(options, function (error, response, body) {
    if (!error) {
      //We should receive  { access_token: ACCESS_TOKEN }
      //Parse the token from the response
      body = JSON.parse(body);
      var accessToken = body.access_token;
        //Allow the access token to be used accross routes
      ssn.accessToken =accessToken;
      console.log("Access Token: ", accessToken);
      //Set the token in cookies so the client can access it
      res.cookie('accessToken', accessToken, { });
      //Send user to get workspaces route
      res.redirect('/getWorkspaces');
    } else {
      console.log('Post request failed');
      console.log(error);
    }
  });
});
//--------------OAUTH---------------//

//--------------Defining where to send requests ---------------//
//Display the index.html page
/*
-When http://localhost:3000 is requested a get request for the route '/' is fired 
-this route uses a function that redirects the user to the index.html file located in the public folder
-this index file requires our rallyWDC.js file which is where Web data connector is held
*/
app.get('/', function(req, res) {
  console.log("Display WDC");
    //Send client to index page
  res.redirect('/index.html');
});

//Get the workspaces the user has access too
/*
-When http://localhost:3000/getWorkspaces is requested  the getWorkspaces route in the routes folder is used
-from that route we make our workspace query
*/
app.use('/getWorkspaces', getWorkspaces);

//Get the projects the user has access too
/*
-When http://localhost:3000/getProjects is requested the getProjects route in the routes folder is used 
-from that route we make our project query
*/
app.use('/getProjects', getProjects);

//Get the project the user selected and send data to tableau
/*
-When http://localhost:3000/getTableauData is requested the getTableauData route in the routes folder is used 
-from that route we get the project the user selected from the drop down and return the user to the index page where the rallyWDC.js file is fired again
*/
app.use('/getTableauData', getTableauData);
//--------------Defining where to send requests ---------------//

//Export the instance
module.exports = app;