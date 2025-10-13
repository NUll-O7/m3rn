const tasks = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    title: `Task ${i}`,
    description: `This is the description for task ${i}`,
    priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
    isCompleted: Math.random() > 0.5,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000),
}));

module.exports = tasks;