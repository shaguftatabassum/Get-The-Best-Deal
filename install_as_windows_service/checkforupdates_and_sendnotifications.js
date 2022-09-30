// This is the function which gets installed as windows service. (It can be done for other
//operating systems as well using suitable modules like node-mac,node-linux).

//Whenever the system boots,This automatically fetches current prices for different products and saves them
// in the database.

// This function also sends system notifications letting the user know about the minimum prices 
// of each product. If you click the notification then it opens the corresponding webpage.

//Also it saves the minimum price & corresponding link for each product in TEXT FILES, so that user 
// can view them later.

 const MongoClient=require('mongodb').MongoClient;
 const request = require('request');  // for making http calls
 const cheerio = require('cheerio'); // for scraping static content
 const getdetails=require('./../get_details_of_site');
 const notifier=require('node-notifier'); //For sending notifications
 const open=require('open'); // Open stuff like URLs, files, executables
  var fs=require('fs'); // provides an API for interacting with the file system


MongoClient.connect('mongodb://localhost', function (err, client) {
   if (err) throw err;
   var db = client.db('User1');

      
    db.listCollections().toArray( function(err,cols) {
        if(err)console.log('error in list Collections',err);
        let expect1=cols.length; 
        console.log('cols.len',expect1);
       
       
          cols.forEach( function(col){
             console.log(col.name); 
             db.collection(col.name).find({}).toArray( function(err,docs){
                          
            	 expect1=expect1+docs.length-1;
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
                                   
                            db.collection(col.name).findOneAndUpdate(myquery,newvalues, function(err,res){
                                expect1--;
                                if(err)console.log('error'+ err);
                                console.log('its done',_price);
                                console.log(expect1); 
                                if(expect1 === 0){
                                   console.log('Transfering control to savecurrentmin');
                                   client.close();
                                   savecurrentmin();

                                }
                            });

                         }
                      });

                });
         });
         		
       
});
});
});




function savecurrentmin(){
     const MongoClient=require('mongodb').MongoClient;
   const fs=require('fs');
   let symbol='₹';
  
   MongoClient.connect('mongodb://localhost', function (err, client) {
     if (err) throw err;
     var db = client.db('User1');

      db.listCollections().toArray( function(err,collections) {
      if(err)console.log('error in list Collections',err);
      let expect=collections.length;
       
          collections.forEach( function(collection){

              db.collection(collection.name).find({}).sort({ price : 1}).limit(1)
              .toArray(function(er,doc){
                     if(er)throw er;
                     let required_result=[];
                     required_result[0]=collection.name;
                     required_result[1]=doc[0]._id;
                     required_result[2]=doc[0].site;
                     required_result[3]=symbol+' '+doc[0].price;
                     required_result[4]=doc[0].link;
                         fs.writeFile('./check_current_min_prices/'+collection.name+'.txt', required_result[3]+" "+ required_result[2]+" "+ required_result[4], function (err) {
                          if (err) throw err;
                          console.log('Saved!');
                          });

                          const WindowsToaster = require('node-notifier').WindowsToaster;
 
                          var notifier = new WindowsToaster({
                              withFallback: false, // Fallback to Growl or Balloons?
                              customPath: 'C:\\Users\\DELL\\Desktop\\deal_finder\\node_modules\\node-notifier\\vendor\\snoreToast\\SnoreToast.exe'
                           });
 
                          notifier.notify(
                           {
                              title: collection.name, // String. Required
                              message: required_result[3], // String. Required if remove is not defined
                              sound: true, // Bool | String (as defined by http://msdn.microsoft.com/en-us/library/windows/apps/hh761492.aspx)
                              wait: true, // Bool. Wait for User Action against Notification or times out
                            },
                           function(error, response) {
                               console.log('notification sent');
                           });
                           notifier.on('click', function () {
                              open(doc[0].link);
                           });   
             
          });
       });
    });
});
   
}