if (window.location.hash) {
    var hashString = window.location.hash.substr(1);
    var hashArray = hashString.split("&");
    var accessKeyArray = hashArray[0].split("=");
    var accessToken = accessKeyArray[1];
    console.log(accessToken);
} else {
    alert("You need to Authorise Spotify"); //use modal instead
}
$(document).ready(function() {

    //declare global variables
    var userId;
    var cityPlaylist = {};
    var city;
    var currentPlaylistId;
    var playlistArray = [];


    function displayCities() {

        var cityArray = localStorage.getItem('citiesAndState');
        cityArray = JSON.parse(cityArray);
        console.log(cityArray);
        console.log("display cities ran");
        $("#city-list").empty();

        for (var i = 0; i < cityArray.length; i++) {
            var cityRow = $("<tr>");
            var cityCell = $("<td>");
            var cityState = cityArray[i];
            var citySplit = cityState.split(",");
            var city = citySplit[0];
            cityRow.addClass("deselected");
            cityRow.attr("data-item-city", city);

            cityCell.append(cityState);
            cityRow.append(cityCell);
            $("#city-list").append(cityRow);
        }
    }
    //function to get user id
    function getUserId() {
        $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
            success: function(response) {

                userId = response.id;
                console.log(userId);

            } //ends success function

        }) //ends ajax call
    } //ends getuserid function

    //spotify auth redirect on clicking authorise button
    $("#spotAuth").on("click", function(event) {
        event.preventDefault();
        window.location = "https://accounts.spotify.com/authorize?client_id=4a7d4aa309ce40a9b644635d2e74b1bb&redirect_uri=https://ovie4.github.io/Roadtrip-Spotify-API-testing/&response_type=token&state=123";
    }); //ends spotify authorisation

    //get user ID after authentication
    getUserId();

    // this click listener will need to be updated to trigger after 
    //second Google AJAX call, (?within continue button?)
    $("#continue").on("click", function(e) {
        e.preventDefault();
        setTimeout(displayCities, 10000);
        console.log("ran displayCities");
    });

    // function sets the clicked table row to 'active' and 
    // sets all other rows to 'inactive'
    // *enhancement* can be updated for multiple 'active' selections
    $("#city-table tbody").on("click", "tr", function() {
        $(this).toggleClass("selected deselected");
        $(this).siblings().attr("class", "deselected");
        var b = $(".selected").attr("data-item-city");
        console.log(b);

    });
    // city variable needed for Spotify query
    // *enhancement* will need updates if allowing multiple selections
    city = $(".selected").attr("data-item-city");
    console.log(city);



    $("#curate").on("click", function() {
        //take value from selection on form and get city

        playlistArray = [];
        city = 'atlanta';
        //whatever is passed from the click event
        //for each city ,call spotify and get corresponding playlist
        function getCityPlaylistObj() {
            //create new array of playlists
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

            }); //end ajax call
        } //end getCityPlaylistObj function
        getCityPlaylistObj();
        //function to randomise playlist selection
        function randomPlaylistSel() {
            //check to see which city was clicked

            //get a random value from the corresponding array
            var randomiser = Math.round(Math.random() * playlistArray.length);
            //something isn't right around here..
            console.log(randomiser);
            console.log(playlistArray);
            currentPlaylistId = playlistArray[randomiser];
            console.log(currentPlaylistId);
            console.log(userId);
            var iframeLink = "https://open.spotify.com/embed?uri=spotify:user:"+userId+":playlist:"+currentPlaylistId+"width=300 height=380 frameborder=0 allowtransparency=true";
            $("#playlist-page").html('<iframe src=' + iframeLink + '></iframe>');
        } //end of randomPlaylistSel
        randomPlaylistSel();
        setTimeout(randomPlaylistSel, 5000);

    }); //ends continue button click listener









}) //ends document ready


//get spotify authorisation
//var clientID = "4a7d4aa309ce40a9b644635d2e74b1bb";
//var clientSecret = "e85c7c6bd60c48d1986be1d5b6b3095c";
//var scope = "playlist-modify-public";
//var redirectUri = 'https://ovie4.github.io/Roadtrip-Spotify-API-testing/index.html';
//var spotifyAuthUrl = 'https://accounts.spotify.com/authorize?client_id=' + clientID + '&redirect_uri=' + redirectUri + '&scope=' + scope + '&response_type=token';