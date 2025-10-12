const http = require('http');
const fs = require('fs');

http.createServer((req,res)=>{
    let log = `${Date.now()} : ${req.url} New Req recieved\n`;
    console.log(log);

    fs.appendFile('log.txt',log,function(err,data){
        console.log("Log Updated");
    });

    switch(req.url){
        case '/':
            res.end('Welcome to Home Page');
            break;
        case '/about':
            res.end('Welcome to About Page');
            break;
        case '/contact':
            res.end('Welcome to Contact Page');
            break;
        default:
            res.end('404 Page Not Found');
            break;
    }
}).listen(8000,()=>{
    console.log("Server is listening on port 8000");
});

