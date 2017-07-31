/*
-This is the Web Data Connector
*/
(function() {
    console.log("Rally WDC Has Started");
    //Settings configuration for oauth requests
    var config = {
      state: '1234-5678-90',
      response_type:'code',
      redirectUri: 'http://localhost:3000/redirect', //This is the same as callback url that you set in oauth settings in rally during setup
      client_id: 'f644fa154f85470f84f9edaf0c8bc59b',
      authUrl: 'https://rally1.rallydev.com/',
      scope: 'alm'
  };
    
    //When the index page is loaded this function is called
    $(document).ready(function() {
        //Getting the access token from cookie storage
      var accessToken = Cookies.get("accessToken");
        //Logic for displaying UI on index page
      var hasAuth = accessToken && accessToken.length > 0;
        //Callling helper function for setting UI
      updateUIWithAuthState(hasAuth);
        
        //When connection button is clicked on the index.html page this function is called
      $("#connectbutton").click(function() {
          //Helper function to authenticate the client
          doAuthRedirect();
      });
  });
    
    //This is the helper function that creates the authredirect url and then sends the user to this url to authenticate the user and get the OAuth token
    function doAuthRedirect() {
        //Creating the url to authenticate the client using config from above
      var url = config.authUrl + 'login/oauth2/auth?state=' + config.state +
              '&response_type=' + config.response_type + '&redirect_uri=' + config.redirectUri + '&client_id=' + config.client_id + '&scope=' + config.scope;
        //Sends the user to the url when connectbutton is clicked
      window.location.href = url;
  }
    
    //------------- OAuth Helpers -------------//
    //This function creates the query that is used to retrerive the data the user requested from the Rally API
    function createQueryURL(type,query,fetch,pagesize) {
      return 'https://rally1.rallydev.com/slm/webservice/v2.0/' + type + '?&query=' + query + '&fetch=' + fetch+ '&pagesize=' + pagesize;
  }
    // This function togglels the label shown depending
    // on whether or not the user has been authenticated
    function updateUIWithAuthState(hasAuth) {
      if (hasAuth) {
          $(".notsignedin").css('display', 'none');
          $(".signedin").css('display', 'block');
      } else {
          $(".notsignedin").css('display', 'block');
          $(".signedin").css('display', 'none');
      }
  } 
    
  //------------- Tableau WDC code -------------//
  // Create tableau connector, should be called first
    var myConnector = tableau.makeConnector();
    
    //myConnector.int is called at the beggining of every phase
    myConnector.init = function(initCallback) {
        //Get the access token from cookie storage
      var accessToken = Cookies.get("accessToken");
        
      console.log("Access Token: ", accessToken);
        
        //Logic for UI 
      var hasAuth = (accessToken && accessToken.length > 0) || tableau.password.length > 0;
        
        //Calls helper function to update the UI
      updateUIWithAuthState(hasAuth);
        
        //Function called when get data button is clicked
      $("#getdatabutton").click(function() {
          //Setting the tableau connection name
          tableau.connectionName = "Rally Web Data Connector";
          //Always showing authorization 
          tableau.alwaysShowAuthUI =true;
          //Sending info to tableau
          tableau.submit();
      });
        
      //Call back to Init fuction
      initCallback();

      // If we are not in the data gathering phase, we want to store the token
      // This allows us to access the token in the data gathering phase
      //Check to see what phase of the web data connector is broken up into
      if (tableau.phase == tableau.phaseEnum.interactivePhase || tableau.phase == tableau.phaseEnum.authPhase) {
          if (hasAuth) {
              //Store the access token in tableau
              tableau.password = accessToken;
              if (tableau.phase == tableau.phaseEnum.authPhase) {
                // Auto-submit here if we are in the auth phase
                tableau.submit()
              }
              return;
          }
      }
  };
    //Defining table schema
    myConnector.getSchema = function (schemaCallback) {   
        console.log("Get Schema Function Started");
        tableau.log("Get Schema Function Started");
    //defining schemas to place data     
    var userStory_cols = [
            // Define an id,  alias, and data type to create a col in the tabel
        { id : "FormattedID", alias : "FormattedID", dataType : tableau.dataTypeEnum.string }, 
        
        { id : "PlanEstimate", alias : "Plan Estimate", dataType : tableau.dataTypeEnum.float },
        
        { id : "Rank", alias : "Rank", dataType : tableau.dataTypeEnum.float },
        
        { id : "ScheduleState", alias : "Schedule State", dataType : tableau.dataTypeEnum.string },
        
        { id : "IterationName", alias : "Iteration Name", dataType : tableau.dataTypeEnum.string },
        
        { id : "IterationID", alias : "Iteration ID", dataType : tableau.dataTypeEnum.string },
        
        { id : "Tags", alias : "Tags", dataType : tableau.dataTypeEnum.string },
        
        { id : "StoryType", alias : "Story Type", dataType : tableau.dataTypeEnum.string },
        
        { id : "WorkState", alias : "Work State", dataType : tableau.dataTypeEnum.string },
        
        { id : "AcceptedDate", alias : "Accepted Date", dataType : tableau.dataTypeEnum.date },
        
        { id : "IsTestable", alias : "Is Testable", dataType : tableau.dataTypeEnum.string },
        
        { id : "FeatureNumber", alias : "Feature Number", dataType : tableau.dataTypeEnum.string },
        
        { id : "FeatureName", alias : "Feature Name", dataType : tableau.dataTypeEnum.string },

        { id : "OwnerName", alias : "Owner Name", dataType : tableau.dataTypeEnum.string },
        
        { id : "ProjectName", alias : "Project Name", dataType : tableau.dataTypeEnum.string },
        
        { id : "ProjectID", alias : "Project ID", dataType : tableau.dataTypeEnum.string },
        
        { id : "ReleaseName", alias : "Release Name", dataType : tableau.dataTypeEnum.string },
        
        { id : "ReleaseID", alias : "Release ID", dataType : tableau.dataTypeEnum.string },
        
        { id : "Capability", alias : "Capability", dataType : tableau.dataTypeEnum.string },
        
        { id : "RunDate", alias : "Run Date", dataType : tableau.dataTypeEnum.date },
        
        { id : "LastUpdate", alias : "Last Update", dataType : tableau.dataTypeEnum.string },
        
        { id : "ObjectID", alias : "User Story ID", dataType : tableau.dataTypeEnum.string },
        
        { id : "DirectChildren", alias : "Children Count", dataType : tableau.dataTypeEnum.string },
        
        { id : "Name", alias : "Name", dataType : tableau.dataTypeEnum.string },
        
        { id : "Description", alias : "Description", dataType : tableau.dataTypeEnum.string },
        
        { id : "Ready", alias : "Ready Checkmark", dataType : tableau.dataTypeEnum.string },
        
        { id : "AcceptanceCriteria", alias : "Acceptance Criteria", dataType : tableau.dataTypeEnum.string },
        
        { id : "Discussion", alias : "Discussion Count", dataType : tableau.dataTypeEnum.float },
        
        { id : "Blocked", alias : "Blocked", dataType : tableau.dataTypeEnum.string },
        
        { id : "TaskEstimateTotal", alias : "Task Estimate Total", dataType : tableau.dataTypeEnum.float },
        
        { id : "TaskRemainingTotal", alias : "Task Remaining Total", dataType : tableau.dataTypeEnum.float },
    ];
        //Defining the table for tableau
    var userStoryTabel = {
        id : "UserStory",
        alias : "User Story Data",
        columns : userStory_cols,
        incrementColumnId: "RunDate"
    };

//Telling tableau what tabels it should expect to get data for can be multiple tables
  schemaCallback([userStoryTabel]);
};
    //Gathering data for tableau only called during the get data phase
    myConnector.getData = function(table, doneCallback) {
        console.log("Get Data Function Called");
        tableau.log("Get Data Function Called");
            
        //Get the project the user requested data for from cookies
        var projectID = Cookies.get("projectID");
          
        //The table the data will be stored in
        var tableData = [];
        
        //--------------Setting Date----------------//
        var today = new Date();
        var dd = today.getDay();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        //Incremental Refresh
        var incrementDate = new Date();
        incrementDate = Date.parse(table.incrementValue || 1);
        
        if(dd<10) {dd = '0'+dd} 

        if(mm<10) {mm = '0'+mm}
        
        today = mm + '/' + dd + '/' + yyyy;
        var todayTest=today+1;
        //--------------Setting Date----------------//
        
        //Getting access token from tableau password storage
        var accessToken = tableau.password;
       
        //Checking to see which table is being requested to get data for 
        if (table.tableInfo.id == "UserStory"){
               //Creating the request to retreive data from rally
        var xhr = $.ajax({
            //Sending the access token to rally to show we have been authenticated 
            beforeSend: function(request) {
            request.setRequestHeader("zsessionid", accessToken);
                    },
            //Url that for that request
          url: "https://rally1.rallydev.com/slm/webservice/v2.0/hierarchicalrequirement?project/"+projectID+"&query=(((Iteration.Name = "+ '"OC-P5.R3-Sprint 13"' + ") OR (Iteration.Name = "+ '"OC-P5.R3-Sprint 12"' + ")) OR (Iteration.Name = "+ '"OC-P5.R3-Sprint 11"' + "))&fetch=FormattedID,PlanEstimate,Rank,ScheduleState,Tags,Type,WorkState,AcceptedDate,IsTestable,Capability,RundDate,ObjectID,DirectChildrenCount,Name,Iteration,Parent,Owner,Release,c_type,Feature,c_AcceptanceCriteria,Description,Ready,c_OriginalRank,Discussion,Blocked,TaskEstimateTotal,TaskRemainingTotal&pagesize=200",

          
          dataType: 'json',
          success: function (data) {
                //Where all the JSON data is stored
              var feat=data;
              console.log(feat);
                    //Reterving data for entery in feat object
              for (var i = 0, len = feat.QueryResult.Results.length; i < len; i++) {
                    //pushing data to tableau tabel object
                    tableData.push({
                    "FormattedID": feat.QueryResult.Results[i].FormattedID,
                    "PlanEstimate": feat.QueryResult.Results[i].PlanEstimate,
                    "Rank": feat.QueryResult.Results[i].Rank,
                    "ScheduleState": feat.QueryResult.Results[i].ScheduleState,
                    "IterationName": feat.QueryResult.Results[i].Iteration,
                    "IterationID": feat.QueryResult.Results[i].Iteration,
                    "Tags": feat.QueryResult.Results[i].Tags,
                    "StoryType": feat.QueryResult.Results[i].c_Type,
                    "WorkState": feat.QueryResult.Results[i].c_WorkState,
                    "AcceptedDate": feat.QueryResult.Results[i].AcceptedDate,
                    "IsTestable": feat.QueryResult.Results[i].c_IsTestable,
                    "FeatureNumber": feat.QueryResult.Results[i].Feature,
                    "FeatureName": feat.QueryResult.Results[i].Feature,
                    "OwnerName": feat.QueryResult.Results[i].Owner,
                    "ProjectName": feat.QueryResult.Results[i].Project._refObjectName,
                    "ProjectID": feat.QueryResult.Results[i].Project._ref.substring(feat.QueryResult.Results[i].Project._ref.lastIndexOf("/")+1, feat.QueryResult.Results[i].Project._ref.length ),
                    "ReleaseName": feat.QueryResult.Results[i].Release,
                    "ReleaseID": feat.QueryResult.Results[i].Release,
                    "Capability": feat.QueryResult.Results[i].c_Capability,
                    "RunDate": today,
                    "ObjectID": feat.QueryResult.Results[i].ObjectID,
                    "DirectChildren": feat.QueryResult.Results[i].DirectChildrenCount,
                    "Name": feat.QueryResult.Results[i]._refObjectName,
                    "Description":feat.QueryResult.Results[i].Description,
                    "Ready":feat.QueryResult.Results[i].Ready,
                    "AcceptanceCriteria":feat.QueryResult.Results[i].c_AcceptanceCriteria,
                    "Discussion":feat.QueryResult.Results[i].Discussion.Count,
                    "Blocked":feat.QueryResult.Results[i].Blocked,
                    "TaskEstimateTotal":feat.QueryResult.Results[i].TaskEstimateTotal,
                    "TaskRemainingTotal":feat.QueryResult.Results[i].TaskRemainingTotal,
                                }); 
                    }
              
                  //Error Handeling  
              for (var i = 0, len = feat.QueryResult.Results.length; i < len; i++){
                   //If a user story has an itteration update its info     
                if(tableData[i].IterationID !== null)
                {
                    tableData[i].IterationName= feat.QueryResult.Results[i].Iteration._refObjectName;
                                    
                    tableData[i].IterationID= feat.QueryResult.Results[i].Iteration.ObjectID;
                }
                    //If a user story has an itteration update its info  
                if(tableData[i].FeatureName !== null)  { 
                try{
                
                    tableData[i].FeatureNumber=  feat.QueryResult.Results[i].Feature.ObjectID;
                                    
                    tableData[i].FeatureName= feat.QueryResult.Results[i].Feature.Name;
                
            }
                    //If a userstory doesnt have any features #########################################333
                catch(e){
                    tableData[i].FeatureNumber =null;
                
                    tableData[i].FeatureName= null;
            }
            }
                //If a user story has an owner update the tabel
                if(tableData[i].OwnerName !== null)
                {
                    tableData[i].OwnerName= feat.QueryResult.Results[i].Owner._refObjectName;           
                }
                //If a use stor has a realease update the tabel
                if(tableData[i].ReleaseName !== null)
                {
                    tableData[i].ReleaseName=  feat.QueryResult.Results[i].Release.Name;
                                    
                    tableData[i].ReleaseID= feat.QueryResult.Results[i].Release.ObjectID;
                }
                    //
                try
                {
                    tableData[i].Tags= feat.QueryResult.Results[i].Tags._tagsNameArray.Name;           
                }
                catch(e){
                     tableData[i].Tags= feat.QueryResult.Results[i].Tags;
                }
                                                            } 
                table.appendRows(tableData);
                doneCallback();
                                               }
        });     
    }
};
    //Register connector with tableau 
    tableau.registerConnector(myConnector);
})();

