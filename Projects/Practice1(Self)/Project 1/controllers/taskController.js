const tasks = require('../models/tasks.js');

if (!Array.isArray(tasks)) {
  console.error('Expected tasks to be an array but got:', tasks);
}

const validateTask = (req,res,next) => {
    const {title, priority} = req.body;
    if(!title || title.trim().length < 3){
        return res.status(400).json({error: 'Title is required and should be at least 3 characters long'});
    }
    if(priority && !['low', 'medium', 'high'].includes(priority)){
        return res.status(400).json({error: 'Priority must be one of low, medium, high'});
    }
    next();
}

const getAllTasks = (req,res)=>{
    // fallback to empty array if tasks is not iterable
    let result = Array.isArray(tasks) ? [...tasks] : [];

    if(req.query.completed){
        const isCompleted = req.query.completed === 'true';
        result = result.filter(task => task.completed === isCompleted);
    }

    if(req.query.priority){
        result = result.filter(task => task.priority === req.query.priority);
    }

    if(req.query.sort){
        const [field, order] = req.query.sort.split('_');
        result.sort((a,b) => {
            return order === 'asc' ? a[field].localeCompare(b[field]): b[field].localeCompare(a[field])
        });
    }

    res.json(result);
}

const getTask = (req,res)=>{
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if(!task){
        return res.status(404).json({error: `task with id ${req.params.id} not found `});
    }
    res.json(task);
}

const patchTask = (req, res) =>{
    const T_index = tasks.findIndex(t=>t.id === parseInt(req.params.id));
    if(T_index === -1){
        return res.status(404).json({error: `task with id ${req.params.id} not found `});
    }
    const allowedUpdates = ['title', 'description', 'priority', 'isCompleted', 'dueDate'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if(!isValidOperation){
        return res.status(400).json({error: 'Invalid updates!'});
    }
    updates.forEach(update => tasks[T_index][update] = req.body[update]);
    res.json(tasks[T_index]);
}

const postTask = (req,res) =>{
    const newTask = {
        id: tasks.length+1,
        title:req.body.title,
        description:req.body.description || '',
        priority:req.body.priority || 'medium',
        isCompleted: false,
        createdAt: new Date(),
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
}

const deleteTask = (req,res) =>{
    const id = parseInt(req.params.id);
    const TaskIndex = tasks.findIndex(t=>t.id === id);
    if(TaskIndex === -1){
        return res.status(404).json({error: `task with id ${req.params.id} not found `});
    }
    const deletedTask = tasks.splice(TaskIndex,1);
    res.status(204).json(deletedTask[0]);
}

module.exports = {
    validateTask,
    getAllTasks,
    getTask,
    postTask,
    patchTask,
    deleteTask
};