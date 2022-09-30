let details=[];
details[0]=['amazon',"#priceblock_ourprice",2];
details[1]=['flipkart',"div[class='_1vC4OE _3qQ9m1']",1];

let size=details.length;

function getsitedetails(url){
	  for(let i=0;i<size;i++){
           if(url.search(details[i][0])!=-1){
           	
               return details[i];
           }

     }
}
module.exports.getsitedetails=getsitedetails;