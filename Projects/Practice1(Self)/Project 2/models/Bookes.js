const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type:String,
        required:[true, "Book Title is required"],
        trim:true,
        unique:true,
        minLength:[2, "Minimum 2 characters required"],
        maxLength:[100, "Maximum 100 characters allowed"]
    },
    author:{
        type:String,
        required:[true,"Author name is required"],
        trim:true,
    },
    isbn:{
        type:String,
        required:[true,"ISBN is required"],
        unique:true,
        trim:true,
        validate:{
            validator:function(v){
                return /^[0-9-]{10,17}$/.test(v);
            }
        }
    },
    publishedYear:{
        type:Number,
        min:[1000, "Year must be after 1000"],
        max:[new Date().getFullYear(), `Year can't be in the future`],
    },
    genres: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one genre must be specified'
    }
  },
  available: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  }
}, {
  timestamps: true
});

bookSchema.virtual('age').get(function(){
    return new Date().getFullYear() - this.publishedYear;
});

bookSchema.methods.makeUnavailable = function(){
    this.available = false;
    return this.save();
}

bookSchema.statics.findByGenre = function(genre){
    return this.find({ genres: genre });
}

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;