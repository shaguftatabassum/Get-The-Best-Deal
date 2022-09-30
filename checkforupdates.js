// This function is called when the server is made online.It fetches the current prices for different 
//products using the link saved in database and saves them.
// It can also be called by user from the Update Prices TAB.

function updateprices(){
 const MongoClient=require('mongodb').MongoClient;
 const request = require('request');
 const cheerio = require('cheerio');
 const getdetails=require('./get_details_of_site');
 


MongoClient.connect('mongodb://localhost', function (err, client) {
     if (err) throw err;
     var db = client.db('User1');

      
       db.listCollections().toArray( function(err,collections) {
           if(err)console.log('error in listcollections',err);

           collections.forEach( function(collection){
                console.log(collection.name);
                db.collection(collection.name).find({}).toArray( function(err,docs){
            	
                   docs.forEach( function(doc){
                       
                        
                        request( doc.link , function (error, response, html) {
                          if (!error && response.statusCode == 200) {
                          	   console.log(doc.price);
                       	       let result=getdetails.getsitedetails(doc.link);
                               var $ = cheerio.load(html);
                               let _price=$(result[1]).text();
  	                           _price=_price.substr(result[2]);
  	                           _price=_price.replace(/,/g,"");
                               console.log(_price); 
                               var myquery = { _id : doc._id  };
                               var newvalues = { $set: {price: parseInt(_price) } };              
                                   
                               db.collection(collection.name).findOneAndUpdate(myquery,newvalues, function(err,res){
                                     if(err)console.log('error in updating '+ err);
                                     console.log('its done',_price);
                                });

                         }
                      });

                });
         });
         		
       
});
});
});
}

module.exports.updateprices=updateprices;