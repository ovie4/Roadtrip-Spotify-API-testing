if (window.location.hash) {
    var hashString = window.location.hash.substr(1);

    var hashArray = hashString.split("&");

    console.log(hashArray);

    var accessKeyArray = hashArray[0].split("=");
    console.log(accessKeyArray);
    var accessToken = accessKeyArray[1];
    console.log(accessToken);
    //get user ID after authentication
    getUserId();
} else {
   alert("You need to Authorise Spotify");
}

$(document).ready(function() {

    
    //get spotify authorisation
    var clientID = "4a7d4aa309ce40a9b644635d2e74b1bb";
    var clientSecret = "e85c7c6bd60c48d1986be1d5b6b3095c";
    var scope = "playlist-modify-public";
    var redirectUri = 'https://jshockley99.github.io/Roadtrip/index.html';
    var spotifyAuthUrl = 'https://accounts.spotify.com/authorize?client_id=' + clientID + '&redirect_uri=' + redirectUri + '&scope=' + scope + '&response_type=token';

    //spotify auth redirect on clicking authorise button
    $("#spotAuth").on("click", function(event) {
        event.preventDefault();

        window.location = "https://accounts.spotify.com/authorize?client_id=4a7d4aa309ce40a9b644635d2e74b1bb&redirect_uri=https://jshockley99.github.io/Roadtrip&response_type=token&state=123";
    });//ends spotify authorisation

    //declare global variables
    var userId;
    var cityPlaylist = {};
    var city = "";
    var currentPlaylistId;
    //function to get user id
    function getUserId(){
    	$.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                },
                success: function(response) {
                console.log(response);
                userId = response.id;

                } //ends success function

            })//ends ajax call
    }//ends getUserId function

    //get spotify user id
    //getUserId();
    //on clicking continue button
    $("#continue").on("click", function() {
        //take value from selection on form and get city
        //get city from array parsed from localStorage
     	city = "charlotte"; //whatever is passed from the click event
        //for each city ,call spotify and get corresponding playlist
        function getCityPlaylistObj() {
            //create new array of playlists
            var playlistArray = [];
            
            $.ajax({
                url: 'https://api.spotify.com/v1/search?q=' + city + '&type=playlist',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                },
                success: function(response) {
                    var data = response.playlists.items;
                    console.log(data);
                    //loop through data array and push new playlists into playlist array
                    for (var i = 0; i < data.length; i++) {
                        var playlistID = data[i].id;
                        playlistArray.push(playlistID);
                    }
                    console.log(playlistArray);
                    //create object using city and playlistArray as key value pairs
                    cityPlaylist[city] = playlistArray;
                    console.log(cityPlaylist);
                } //end ajax call function
                //display playlist in browser
            }); //end ajax call
        } //end getCityPlaylistObj function
        getCityPlaylistObj();
	//function to randomise playlist selection
    function randomPlaylistSel(){
    	//check to see which city was clicked

    	//get a random value from the corresponding array
    	var randomiser = Math.round(Math.random()*playlistArray.length)
    	currentPlaylistId = playlistArray[randomiser];
    	$("#playlist-page").append('<iframe src="https://open.spotify.com/embed?uri=https://open.spotify.com/user/"'+userId+'"/playlist/"'+currentPlaylistId+'"&theme=white" width="100%" height="380" frameborder="0" allowtransparency="true"></iframe>')
    }//end of randomPlaylistSel
    }); //ends continue button click listener
   
    



});