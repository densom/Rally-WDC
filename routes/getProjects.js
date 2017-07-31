//Create a router object
var express = require('express');
var router = express.Router();
//Create a session 
var session = require('express-session');
var request = require('request');
//create session variable
var ssn;

//Get the Workspace the user selected
/*
-Based on the workspace the user selected from the dropdown on the workspaceSelection page a query is created to find what projects are aviable under that workspace
-When the getProjects route recives a post request when the workspaceButton button is pressed on the workspaceSelection page a function if fired 
-the getProjects route first gets the workspace the user selected from the dropdown and saves the response in the variable workspaceID

*/
router.post('/',function(req,res,next){ 
    ssn = req.session;
    //Getting the user selected workspace
    var workspaceResponse = req.body.workspace;
        console.log("User Selected: ", workspaceResponse);
        //Creating an Array to Loop Through
        var workspace=[ssn.workspacesJSON];
        //Looping through Array to check value and find workspaceID
        workspace[0].QueryResult.Results.forEach(function(item){
                //If the item in the workspace array matches the one the user requested the workspace ID is saved and shared with all routes
                if(item._refObjectName === workspaceResponse){
                   //Workspace ID 
                    console.log(item._ref.substring(item._ref.lastIndexOf("/")+1, item._ref.length));
                    
                    var workspaceID= item._ref.substring(item._ref.lastIndexOf("/")+1, item._ref.length);
                    
                    ssn.workspaceID=workspaceID;
                }   
            })
    
        console.log("Found Workspace ID");
        next();
            },
            
//Query for projects based on workspace
function(req, res){
    console.log("Project Query Started");
    //Project Query to get all the projects for the selected workspace
     var token_request_header = {
      "zsessionid": ssn.accessToken,
  };
  // Build the get request 
     var options = {
      method: 'GET',
         //This Query retrieves all the parent projects from the workspace the user requested the query (Parent.ObjectID = 42773881065) is the object ID of the parent project that all other OPIM projects fall under
      url: 'https://rally1.rallydev.com/slm/webservice/v2.0/Project?workspace/"+workspaceID+"&query=(Parent.ObjectID = 42773881065)&pagesize=200',
      headers: token_request_header
  };
    
// Make the get request
/*
-Here you save the results of the query in the projectsJSON file and render the projectSelection view with all the avaiable projects the user can get data for
*/
  request(options, function (error, response, body) {
    if (!error) {
        projectsJSON= JSON.parse(body);
        ssn.projectsJSON=projectsJSON;
        console.log('Project Query Completed');
        res.render("projectSelection", {Project: projectsJSON});
    } else {
    console.log('Post request failed')
    console.log(error);
    }
  });   
          });

module.exports = router;