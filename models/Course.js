import { Schema, model } from "mongoose";

const schema = new Schema({
  title: {
    type: String,
    required: [true, "Please enter course title"],
    minLength: [4, "Title must be at least 4 characters"],
    maxLength: [80, "Title must be at least 80 characters"],
  },
  description: {
    type: String,
    required: [true, "Please enter course title"],
    minLength: [20, "Description must be at least 20 characters"],
  },
  lectures: [
    {
      title: {
        type: String,
        require: true,
      },
      description: {
        type: String,
        require: true,
      },
      video: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    },
  ],
  poster: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  viwes: {
    type: Number,
    default: 0,
  },

  numOfvideos: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: [true, "Enter Course Creator Name"],
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Course = model("Course", schema);
