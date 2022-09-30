

const express =require('express');
const hbs =require('hbs');
const parser=require('body-parser');
const MongoClient=require('mongodb').MongoClient;
const getdetails=require('./get_details_of_site');
const usecheerio=require('./using_cheerio_to_scrape');
const update=require('./checkforupdates');
update.updateprices(); // automatically updating the prices when the server is made online.
var app=express();


app.set('view engine' , 'hbs'); //setting handlebars as the view engine
app.use(parser.urlencoded({ extended: false }));
app.use(express.static(__dirname+'/public')); //setting directory of static files which need to be hosted on this server


//this receives the data when user submits the product and url of the product and sends it to 
// 'using_cherio_to_scrape.js' for scraping to find the price.
app.post('/savedata', (req,res)=>{
      let product_url=req.body.aurl;
      let product_name=req.body.pdct;
      let website_name;
      let id_or_class;
      let index ;
     
     console.log(product_url);

      let details=getdetails.getsitedetails(product_url);
              website_name=details[0];
              id_or_class=details[1];
              index=details[2];
      console.log('server ', usecheerio.findprice(product_url,website_name,id_or_class,index,product_name));
       
     res.send("<body bgcolor='cyan'> <center><h2> The Product was added.<br><br> <a href='/homepage.html'> Goto homepage</a></h2></center></body> ");

               
});

//This is called when user wants to know the  minimum price for each product and the corresponding website
// It finds the minimum price & corresponding website for each product and sends it to currentprices.hbs
app.get('/currentprices', (req,res)=>{
  
  let final_result=[];
  let symbol='₹';
  MongoClient.connect('mongodb://localhost', function (err, client) {
     if (err) throw err;
     var db = client.db('User1');

 
  
     db.listCollections().toArray( function(err,cols) {


    	 if(err)console.log('Error Found In ListCollections',err);
         let expect=cols.length;
       
         cols.forEach( function(col){

              db.collection(col.name).find({}).sort({ price : 1}).limit(1)
         	   .toArray(function(er,doc){
         		 if(er)throw er;
         		 let required_result=[];
         		required_result[0]=col.name;
         		required_result[1]=doc[0]._id;
         		required_result[2]=doc[0].site;
         		required_result[3]=symbol+' '+doc[0].price;
         		required_result[4]=doc[0].link;

                    
         		console.log(doc);
         		final_result.push(required_result);
         		
         		if(--expect===0)res.render('currentprices.hbs' , { result : final_result , symbol : symbol });
         	});
       });
             
      

});
});
});

//This is called when user wants to delete some products. It list the products and sends it to
//deleteprice.hbs which asks user to select the products to be deleted.
app.get('/selecttodelete',(req,res)=>{
      let result=[];
       MongoClient.connect('mongodb://localhost', function (err, client) {
       if (err) throw err;
          var db = client.db('User1');
          db.listCollections().toArray( function(err,cols) {
       	      let expect=cols.length;
                      cols.forEach( function(col){
        	          result.push(col.name);
                      if(--expect===0)res.render('deleteproducts.hbs' ,{result : result});
                        });
                   });
       });
});	

//This receives the selected products to be deleted and deletes them from the database.
app.post('/deleteproducts',(req,res)=>{

    var products_to_delete=[];
    products_to_delete=req.body.ask;

   
     
    MongoClient.connect('mongodb://localhost', function (err, client) {
        if (err) throw err;
        var db = client.db('User1');
            
          	for(let i=0;i<products_to_delete.length;i++){ 
          		console.log(products_to_delete[i]);
                db.collection(products_to_delete[i]).drop(function(err, deleted) {
                     if (err) throw err;
                     if (deleted) console.log("Collection deleted");
               });
            }
        
    });
   

    res.send("<body bgcolor='#400000' text='white'> <center><h1>The selected products have been deleted <br><a href='/homepage.html'> Goto homepage</a></h1></center></body>");
});


//Although the prices are automatically updated when the server is made online
// still an option is there for the users to update the prices if they want to.
app.get('/updateprices',(req,res)=>{
	update.updateprices();
	res.send("<body bgcolor='66FFFF'><h1>Updated<p>The prices have been updated<br><br><a href='/currentprices'>Lowest Price List</a><br><br><a href='/homepage.html'> Goto homepage</a> </p></body>");
});




//  This creates the Node.js web server at the specified  port.
app.listen(3000, ()=>{
	console.log('Server is online');
});




