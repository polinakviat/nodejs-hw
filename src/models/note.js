import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/tags.js';


export const Note = model('Note', notesSchema);

const notesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    tag: {
      type: String,
      enum: TAGS,
      default: 'Todo',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true
  }
);

notesSchema.index({ title: 1, content: 1, tag: 1 });
