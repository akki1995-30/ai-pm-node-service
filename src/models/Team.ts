import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
}

const TeamSchema = new Schema(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model<ITeam>("Team", TeamSchema);