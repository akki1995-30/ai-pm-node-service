import mongoose, { Schema, Document } from "mongoose";

export enum TeamRole {
  MANAGER = "MANAGER",
  MEMBER  = "MEMBER",
  VIEWER  = "VIEWER"
}

export interface ITeamMember extends Document {
  team: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  role: TeamRole;
}

const TeamMemberSchema = new Schema(
  {
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: Object.values(TeamRole), default: TeamRole.MEMBER }
  },
  { timestamps: true }
);

// One membership record per user per team
TeamMemberSchema.index({ team: 1, user: 1 }, { unique: true });

export default mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);
