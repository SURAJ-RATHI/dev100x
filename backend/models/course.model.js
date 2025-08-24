import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  content: [{
    type: {
      type: String,
      enum: ['video', 'pdf'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    file: {
      public_id: String,
      url: String,
      size: Number,
      format: String
    }
  }],
  creatorId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
}, {
  timestamps: true
});

export const Course = mongoose.model("Course", courseSchema);
