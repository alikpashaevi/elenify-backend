import mongoose, { Schema } from 'mongoose';

const ImageSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  transformationType: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  secureUrl: {
    type: String, // Change from URL to String
    required: true,
  },
  width: { 
    type: Number 
  },
  height: { 
    type: Number 
  },
  config: { 
    type: Object 
  },
  transformationUrl: { 
    type: String // Change from URL to String
  },
  aspectRatio: { 
    type: String 
  },
  color: { 
    type: String 
  },
  prompt: { 
    type: String 
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User' 
  },
  createdAt: { 
    type: Date, default: Date.now 
  },
  updatedAt: { 
    type: Date, default: Date.now 
  },
});

const Image = mongoose.model('Image', ImageSchema);
export default Image;
