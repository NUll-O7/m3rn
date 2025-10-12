const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json())

mongoose.connect(
    "mongodb+srv://dhruvsonimain_db_user:0LZ0RckdZWSWQekF@notes.otirien.mongodb.net/?retryWrites=true&w=majority&appName=Notes"
).then(() => {
    console.log("DB Connected");
}).catch((err) => {
    console.error("Cannot Connect ", err);
});

let productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },

    product_price: {
        type: Number,
        required: true
    },

    isInStock: {
        type: Boolean,
        required: true
    },

    category: {
        type: String
    }
})

let ProductModel = mongoose.model('products',productSchema)

app.get('/', (req, res) => {
    res.send('Server on')
})

app.post('/api/products', async (req, res) => {
    const body = req.body

    await ProductModel.create({
        product_name: body.product_name,
        product_price: body.product_price,
        isInStock: body.isInStock,
        category: body.category
    })

    res.status(201).json({ message: 'Product Created' })
})

app.listen(3000, () => {
    console.log('Server Started at 3000')
})

app.listen(3000, () => {
    console.log('Server Started at 3000')
})
