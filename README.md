# DocumentDB @ JSMeetup

This contains all materials from the jsmeetup DocumentDB session, including the [demo walkthrough](demowalkthrough.md).

## Afterthoughts

First, let me thank everyone for showing up! Great questions too!
![the audience](https://pbs.twimg.com/media/CTqjHRxUAAE9mA2.jpg:small)

Ok, so after my talk this evening, I had some folks asking questions. I'll
do my best to capture the discussions here.
 
### DocumentDB vs SQL Server

Someone asked how easy it is to migrate data from SQL Server to DocumentDB, along
with the queries. It turns out, it's not a direct mapping / conversion, since
the two database engines use very different ways of representing data. There are many
things to consider when modeling document databases vs relational databases.

This would be a lengthy discussion / blog post. For now, let me offer a few things:

 * Several months ago, I did a live broadcast called "Polyglot Persistence: Choosing the right storage mix."
 This talk, co-presented by Ryan CrawCour (of the DocumentDB team) goes through several
 database types (key/value, document, relational, graph, colum) and highlights optimum use cases for each. And
 then it brings them all together into a single app. Hopefully this helps visualize some of the differences.
 * I recently gave a document-modeling talk at [CloudDevelop](http://clouddevelop.org). Unfortunately the session
 wasn't recorded, but the materials are [here](https://github.com/dmakogon/clouddevelop2015). I'd suggest looking
 at the PowerPoint document for some data modeling thoughts. I'm also recording this session in-studio soon, and
 the video should be available some time in January/February 2016.
 
### Azure and how to get started

Sorry - I never even discussed this. Just visit azure.com and
sign up for a free trial, which gives (I believe) $150 for your first 
month. And the lowest-tier (S1) DocumentDB 10GB collection runs $25/month.

### DocumentDB and shards

Since each collection is 10GB, you'll likely find the need to use multiple collections.
This means you'll probably need a sharding scheme (since DocumentDB doesn't offer
server-side sharding). This is doable in client code, but the SDKs will be 
supporting sharding, starting with the .net SDK which now supports it.
The .NET SDK uses a `Partition resolver` that
lets you specify partition key, from your documents. More
details can be found [here](https://azure.microsoft.com/en-us/documentation/articles/documentdb-sharding/).

### DocumentDB compared with DynamoDB

Someone asked if I have any comparison sheet. I don't, but if I find one, I'll
update this readme and post a link.

### DocumentDB "offline"

Someone asked if it's possible to run DocumentDB locally. It is cloud-only. We
got into an interesting discussion around "working on a plane." I've often had that
opinion as well, where I want to have my full environment available to me. However,
planes are increasingly offering WiFi. And... at the end of the day, do you *really*
want to tell someone you chose the database, the heart of 
 your bread-n-butter money-making, 
critical application... based on your ability to access it during
an extended commute?

All kidding aside: It's a great question. Hopefully this won't be a blocker for you.

## Credits

Since I used some movie data from [themoviedb.org](http://themoviedb.org) for my demos, I'm obligated to provide this bit of
attribution:

Data for the various demos was downloaded from themoviedb.org.
This product uses the TMDb API but is not endorsed or certified by TMDb.

* Specifically, I created scripts to download movie data, which use the TMDb API.
