import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  project: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId;
  status: string;
}

const TaskSchema = new Schema(
  {
    title: { type: String, required: true },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project"
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo"
    }
  },
  { timestamps: true }
);

export default mongoose.model<ITask>("Task", TaskSchema);