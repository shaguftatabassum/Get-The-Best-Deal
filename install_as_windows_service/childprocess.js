// This gets called when we run install/uninstall fucntion in install.js
// It further runs the  'url/run.js' in child_process.exec('node url/run.js')
const fs = require('fs');  
const child_process = require('child_process');  
 
   // child_process.exec This method runs a command in a console and buffers the output
   // the name of the process to run is checkforupdates_and_sendnotifications.js

   var workerProcess = child_process.exec('node checkforupdates_and_sendnotifications.js',  
      function (error, stdout, stderr) {  
         if (error) {  
            console.log(error.stack);  
            
         }  
         console.log('stdout: ' + stdout);  
         console.log('stderr: ' + stderr);  
      });  

      workerProcess.on('exit', function (code) {  
      console.log('Child process exited with exit code '+code);  
   });   