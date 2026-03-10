import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  team: mongoose.Types.ObjectId;
}

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    team: { type: Schema.Types.ObjectId, ref: "Team" }
  },
  { timestamps: true }
);

export default mongoose.model<IProject>("Project", ProjectSchema);