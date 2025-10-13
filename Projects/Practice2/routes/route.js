const router = require("express").Router();
const Comment = require("../model/comment.js");

let todos = Array.from({length:50}, (_,i)=>({id:i, title:`Todo ${i}`, completed: Math.random()>0.5}));
let id = todos.length;

router.use((req, res, next) => {
    req.time = new Date().toISOString();
    next();
});

router.get('/time', (req,res)=>{
    res.json({time:req.time});
})

router.get("/add", (req, res) => {
    const {a,b} = req.query;
    if(a && b){
        const sum = Number(a) + Number(b);
        res.json({sum});
    } else {
        res.json({message: "Please provide both 'a' and 'b' query parameters."});
    }
});

router.get("/divide", (req, res) => {
    const {a,b} = req.query;
    if(a && b){
        if(Number(b) === 0){
            res.status(400).json({error: "Division by zero is not allowed."});
        } else {
            const result = Number(a) / Number(b);
            res.json({result});
        }
    } else {
        res.json({message: "Please provide both 'a' and 'b' query parameters."});
    }
});


router.get("/hello", (req,res)=>{
    res.json({message:"Hello express!"})
});

router.post("/greet", (req,res)=>{
    const name = req.query.name || req.body.name || "Guest";
    res.json({message:`Hello, ${name}!`})
});

router.get("/hello/:name", (req,res)=>{
    const name = req.params.name;
    res.json({message:`Hello, ${name}!`})
});

router.post("/greet", (req,res)=>{
    const name = req.query.name || req.body.name || "Guest";
    res.json({message:`Hello, ${name}!`})
})

router.post('/register',(req,res)=>{
    const {username,password} = req.body;
    if(username && password){
        res.status(201).json({message:`User ${username} registered successfully!`});
    } else {
        res.status(400).json({error: "Username and password are required."});
    }
})

router.post("/todos",(req,res)=>{
    const {title,completed} = req.body;
    if(title && typeof completed === "boolean"){
        res.status(201).json({id:id++, title, completed});
    } else {
        res.status(400).json({error: "Title and completed status are required."});
    }
})

router.put("/todos/:id",(req,res)=>{
    const id = Number(req.params.id);
    const {title,completed} = req.body;
    if(todos[id]){
        todos[id] = {id, title: title || todos[id].title, completed: typeof completed === "boolean" ? completed : todos[id].completed};
        res.json(todos[id]);
    } else {
        res.status(404).json({error: "Todo not found."});
    }
})

router.delete("/todos/:id",(req,res)=>{
    const id = Number(req.params.id);
    if(todos[id]){
        const todo = todos.filter(t=>t.id !== id);
        todos = todo;
        res.status(200).json({message: "Todo deleted successfully."}, todos);
    } else {
        res.status(404).json({error: "Todo not found."});
    }
})

function auth(req,res,next){
    const tokens = req.headers['x-api-key'] !== "12345";
    if(tokens) return res.status(401).json({error: "Unauthorized"});
    next();
}

router.get('/secure',auth,(req,res)=>{
    res.json({message:"Access granted"})
});

async function fetchData(){
    return new Promise(resolve => setTimeout(()=>resolve({data: "ok" }),1000));
}

router.get('/fetch', async (req,res)=>{
    const data = await fetchData();
    res.json(data);
})

function logger(req,res,next){
    console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
    next();
}

function auth2(req,res,next){
    const tokens = req.headers['x-api-key'] !== "admin123";    
    if(tokens) return res.status(401).json({error: "Unauthorized"});
    next();
}

router.get('/admin', logger, auth2, (req,res)=>{
    res.send("Admin Ok");
})

router.post('/comments', async (req,res)=>{
    const comment = req.body;
    try {
        const newComment = await Comment.create(comment);
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({error: "Failed to create comment"});
    }
})

router.get("/posts", async (req,res)=>{
    try {
        if (req.query.author) {
            const posts = await Post.find({ author: req.query.author });
            res.status(200).json(posts);
        } else {
            const posts = await Post.find();
            res.status(200).json(posts);
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch posts"});
    }
})

let cache = null;
let lastFetch = 0;
let CACHE_DURATION = 10000;

router.get("/dcache", (req,res)=>{
    const now = Date.now();
    if(cache && (now - lastFetch) < CACHE_DURATION){
        return res.json({data: cache, source: "cache"});
    }
    cache = {data: "Fresh Data", timestamp: new Date().toISOString()};
    lastFetch = now;
    res.json({data: cache, source: "server"});
});

module.exports = router;