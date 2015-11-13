
var DocumentDBClient = require('documentdb').DocumentClient
  , DocumentBase = require('documentdb').DocumentBase
  , async = require('async')
  , config = require('../config')
  , databaseId = config.names.database
  , collectionId = config.names.collection
  , dbLink

var host = config.connection.endpoint;
var masterKey = config.connection.authKey;

var client = new DocumentDBClient(host, { masterKey: masterKey });


dbLink = 'dbs/' + databaseId;
collLink = dbLink + '/colls/' + collectionId;

console.log(collLink);
        
console.log('getting offer type');
getOfferType(collLink, function (offer) {
    if (offer) {
        console.log('Collection has an Offer Type of \'' + offer.offerType + '\'');
    }
});

function getOfferType(collection, callback) {
    //Collections and OfferTypes are loosely coupled.
    //Offer.resource == collection._self And Offer.offerResourceId == collection._rid    
    //Therefore, to find the OfferType for a Collection, query for Offers by resourceLink matching collectionSelfLink

    var querySpec = {
        query: 'SELECT * FROM root r WHERE  r.resource = @link',
        parameters: [
            {
                name: '@link',
                value: collection //._self
            }
        ]
    };
    
    client.queryOffers(querySpec).toArray(function (err, offers) {
        if (err) {
            handleError(err);
                 
        } else if (offers.length === 0) {
            console.log('No offer found for collection');
            
        } else {
            console.log('Offer found for collection');
            var offer = offers[0];
            callback(offer);
        }
    });
}


function removeRangeIndex(collLink, callback) {

    console.log('adding index to ' + collLink);
       
     var indexPolicySpec = {
        includedPaths: [
            {
                path: "/*",
                indexes: [
                    {
                        kind: "Hash",
                        dataType: "String"
                    },
                    {
                        kind: "Range",
                        dataType: "Number"
                    }
                ]
            }
        ]
    };

    var collSpec = { id: collectionId };
    collSpec.indexingPolicy = indexPolicySpec;
    
    client.replaceCollection(collLink, collSpec, function (err, result) {
        if (err) {
            handleError(err);

        } else {
            console.log('Waiting for index transform to be completed');
    
            waitForIndexTransformToComplete(collLink, function (err) {
                console.log('Index transform completed');               
                callback();
            });
                         
        };
                        
    });
    
}

function waitForIndexTransformToComplete(collLink, callback) {
    //To figure out the progress of and index transform, 
    //do a readCollection and check the 3rd parameter of the callback
    //The headers collection includes a header that indicates progress between 0 and 100
    var progress = 0;
    var count = 0;

    async.whilst(
        function () { return progress > 0 && progress < 100; },
        
        function (cb) {
            console.log('Reading collection');
            client.readCollection(collLink, function (err, coll, headers) {
                if (err) {
                    handleError(err);
                
                } else {
                    progress = headers['x-ms-documentdb-collection-index-transformation-progress'];
                    console.log('Progress is currently ' + progress);
                    
                    console.log('Waiting for 10ms');
                    setTimeout(cb, 10);
                }
            });
        },
        
        function (err) {
            console.log('Done.');
            callback();
        }
    );
}

function handleError(error) {
    console.log('\nAn error with code \'' + error.code + '\' has occurred:');
    console.log('\t' + JSON.parse(error.body).message);
    
    finish();
}

function finish() {
    console.log('\nEnd of demo.');
}