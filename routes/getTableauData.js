//Create a router object
var express = require('express');
var router = express.Router();
var session = require('express-session');
// Require controller modules
var ssn;

//Get the project the user selected
router.post('/',function(req,res,next){ 
    console.log("Get Project Data Request");
    ssn = req.session;
    //Get the project the user requested from the drop down
    var projecteResponse = req.body.project;
    console.log("User Selected: ", projecteResponse);
    //Creating an Array to Loop Through
    var project=[ssn.projectsJSON];
    //Looping through Array to check value and find workspaceID
    project[0].QueryResult.Results.forEach(function(item){
        if(item._refObjectName === projecteResponse){
            console.log("Project ID: ", item._ref.substring(item._ref.lastIndexOf("/")+1, item._ref.length));
            var projectID= item._ref.substring(item._ref.lastIndexOf("/")+1, item._ref.length);
            ssn.projectID=projectID;
                }   
            })
                    next();
            },
    function(req, res){
    //Put the project ID the user selected in cookie storage
    res.cookie('projectID', ssn.projectID, { });
    //Send the user back to the index page
    res.redirect('/');
          });
module.exports = router;