const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  content: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 5000
  },
  imageUrl: { 
    type: String,
    trim: true
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: []
  }],
  comments: [
    {
      text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      createdAt: { 
        type: Date, 
        default: Date.now 
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

postSchema.index({ title: 'text', content: 'text' });

postSchema.virtual('createdAtFormatted').get(function() {
  return this.createdAt.toLocaleDateString();
});

module.exports = mongoose.model('Post', postSchema);