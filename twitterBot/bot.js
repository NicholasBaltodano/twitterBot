/* 
   This bot is programmed to search through it's followers, and tweet them goodmorning.
   It will also respond to any new followers with a greeting and notification of it's purpose. 
   Created on 5.29.17 by Nicholas Baltodano
*/
console.log("The bot is starting");

// Get packages and module exports.
var Twit = require('twit');
var config = require('./config');

// Authenticate to Twitter
var T = new Twit(config);
var stream = T.stream('user');

// Create tweets to be modified and sent
var tweet       = { status: ""}
var followTweet = { status: ""}

// Listen for a new follow event
console.log("New follower stream activated");
stream.on('follow', newFollower);

// Send message to all followers at an interval(24 hours)
setInterval(sendGoodMorningToFollowers, 86400000);


/*****************************************************
* Functions
*****************************************************/
// Tweet to followers
function sendGoodMorningToFollowers()
{
   // Get a twitter user's follower list
   T.get('followers/list', {screen_name: 'NicksTwitBot'}, getFollowers)
}
 
// Go through a follower list and send message to each follower
function getFollowers(err, data, response)
{
   if(err)
      console.log(err.toString());
   else
      for(var index = 0; index < data.users.length; index++)
      {
         tweet.status = "@" + data.users[index].screen_name + " Goodmorning! Have a good day!";
         
         T.post('statuses/update', tweet, tweeted);
      }
}   

// Send thank you message to a new follower
function newFollower (data) 
{
   console.log(data.source.screen_name);
   followTweet.status = "@" + data.source.screen_name + " thanks for the follow. I'll say goodmorning everyday (: "; 
   T.post('statuses/update', followTweet, tweeted);
}

// Run when a search comes back correctly
function searchResults(err, data, response)
{
   // Give variable an array of tweets
   var tweets = data.statuses;
   
   // Print the tweet results from search
   for(var count = 0 ; count < tweets.length; count++)
   {
      console.log(tweets[count].text);
   }
}

// Print result of the tweet attempt
function tweeted (err, data, response) {
   if(err)
   {
      console.log("Something went wrong.");
      console.log(err.toString());
   }
   else
      console.log("The tweet was sent");
}