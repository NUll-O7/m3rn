const http = require('http');

http.createServer((req,res)=>{
    console.log("Request received");
    res.end("Hello World from Dhruv's server");
}).listen(8000,()=>{
    console.log("Server is listening on port 8000");
});

