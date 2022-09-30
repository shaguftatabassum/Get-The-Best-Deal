// The node-windows module is used for service management and  event logging in windows.
// For other operting system node-mac,node-linux are also available.
// This function install/uninstall the checkforupdates_and_sendnotifications.js function as window service.

var Service = require('node-windows').Service;


var svc = new Service({
  name:'Auto Update Prices and sends notifications',
  description: 'Automatically fetches current prices and sends notifications about each product',
  // The absolute url to the function which needs to be installed /uninstalled
  script: 'C:\\Users\\DELL\\Desktop\\deal_finder\\install_as_windows_service\\childprocess.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});
   
 

svc.on('install',function(){
  svc.start();
});

svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});
 
// install the service. To uninstall this service svc.uninstall();
svc.install();

