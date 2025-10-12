const express = require('express');
const app = express();

app.get('/', (req, res)=>{
    res.send('Hello World')
}).listen(3000, ()=>{
    console.log('Server is running on port 3000')
})

app.get('/user', (req, res)=>{
    res.send('User Page')
})

function UserName(req, res, next){
    const name = req.query.name;
    if(name){
        req.name = name;
        next()
    }else{
        res.send('Hello, Guest!')
    }
}

app.get('/user/greet', UserName, (req, res)=>{
    res.send(`Good Morning ${req.name}`)
})

app.get('/about', (req, res)=>{
    res.send('About Page')
})

app.delete('user')