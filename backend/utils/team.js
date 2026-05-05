import mongoose from "mongoose";

export const getTeamObjectId = (teamId) => {
  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    return null;
  }

  return new mongoose.Types.ObjectId(teamId);
};
