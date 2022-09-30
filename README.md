# The-Deal-Finder
**It will keep on notifying you the minimum price for each item you wish to purchase  on various e-commerce sites.**
   Suppose you wish to buy these 2 products:
1. Dell laptop model xyz – which may be available on sites [ site1, site2,…..,siteN]
2. Product2 which may be available on sites[site1, site2,…,siteM]\
   Now you will get notifications as:\
Lowest price for Dell laptop model xyz is ₹ XXXX on siteZ and the link is this.\
Lowest price for Product2 is ₹ XXX on siteL and the link is this.
## Technologies Used
Node.js,MongoDB,JavaScript,HTML,CSS
## Dependencies
node modules --> body-parser,cheerio,child_process,circular-json,express,fs,hbs,mongodb,node-windows,node-notifier,open,request
## Running it as web application
 Install the following dependencies using this command in cmd
 ```
  npm i body-parser cheerio circular-json express fs hbs mongodb node-windows request --save
 ```
Then run ```node server.js``` command in cmd.\
Open ```http://localhost:3000/homepage.html``` in the browser
## Installing this as Windows Service
 When this is installed as windows service, it will automatically check for current price at regular intervals and send you **toast notifications** for each product.These notifications have product name,its minimum cost and
 if you click these notifications the corresponding site will open in the default browser.\
 To install it as windows service install all the dependencies mentioned above.\
 All the functions to install it as windows-service are present in install_as_windows_service folder.\
 **Note** node-windows must be globally installed.
 ```npm i -g node-windows```\
  Run ```node install.js``` to install it as windows service.\
 **NOTE** For other operating systems, similar modules are node-mac,node-linux.
 
 ## Analysis
 This tool helps to save time and money as user just needs to visit the product page once and then this tool automatically fetches the minimum prices for each product and sends notifications at regular intervals.
