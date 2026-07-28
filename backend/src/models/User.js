import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    index: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  college_name: {
    type: String,
    required: [true, 'College name is required'],
    trim: true
  },
  year_of_study: {
    type: String,
    required: [true, 'Year of study is required'],
    trim: true
  },
  is_team_leader: {
    type: Boolean,
    default: false
  },
  team_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
export default User;
