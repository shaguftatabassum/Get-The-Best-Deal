//This function is called when user adds a new product. This function scrapes the current price of the 
//product and saves in the database. Using cheerio for scraping.

function findprice(url,website,id_or_class,index,product_name){
const request = require('request');
const cheerio = require('cheerio');
const MongoClient=require('mongodb').MongoClient;
        
 request ( url , function (error, response, html) {
    
           if (!error && response.statusCode == 200) {
               
               var $ = cheerio.load(html);
               $(id_or_class).each( function() {
                let _price=( $(this).text() );
                _price=_price.substr(index);
                _price=_price.replace(/,/g, "");
               console.log("price is", _price); 
              
                MongoClient.connect('mongodb://localhost', function (err, client) {
                    if (err) throw err;
                    var db = client.db('User1');

                    db.collection(product_name).insertOne({site:website ,price : _price ,link : url}, function (err, result) {
                        if (err) throw err;
                        console.log(result.name);
                        client.close();
              });
            });
        });
 }
           else{
              console.log("error while requesting",error);
            }
});
};

module.exports.findprice=findprice;