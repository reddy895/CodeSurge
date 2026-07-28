import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  team_name: {
    type: String,
    required: [true, 'Team name is required'],
    unique: true,
    trim: true
  },
  team_code: {
    type: String,
    required: [true, 'Team code is required'],
    unique: true,
    index: true,
    uppercase: true,
    trim: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Team creator user ID is required']
  },
  max_members: {
    type: Number,
    default: 4
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Team = mongoose.model('Team', teamSchema);
export default Team;
