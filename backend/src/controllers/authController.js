import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Team from '../models/Team.js';
import { generateTeamCode } from '../utils/generateTeamCode.js';

/**
 * Helper to generate JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { user_id: userId },
    process.env.JWT_SECRET || 'your_secret_key_here',
    { expiresIn: '7d' }
  );
};

/**
 * @desc    Register Team Leader & Create Team
 * @route   POST /api/auth/register/leader
 */
export const registerLeader = async (req, res, next) => {
  try {
    const { name, email, phone, college_name, year_of_study, team_name } = req.body;

    // 1. Validation
    if (!name || !email || !phone || !college_name || !year_of_study || !team_name) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields (name, email, phone, college_name, year_of_study, team_name).'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedTeamName = team_name.trim();

    // 2. Check duplicate email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User email is already registered.'
      });
    }

    // 3. Check duplicate team name
    const existingTeam = await Team.findOne({
      team_name: { $regex: new RegExp(`^${trimmedTeamName}$`, 'i') }
    });
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        error: 'Team name is already taken. Please choose another team name.'
      });
    }

    // 4. Generate unique 6-character team code
    const team_code = await generateTeamCode();

    // 5. Create Team Leader User
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      college_name: college_name.trim(),
      year_of_study: year_of_study.trim(),
      is_team_leader: true
    });

    // 6. Create Team
    const team = await Team.create({
      team_name: trimmedTeamName,
      team_code,
      created_by: user._id,
      max_members: 4
    });

    // 7. Assign team_id to user
    user.team_id = team._id;
    await user.save();

    // 8. Generate Auth Token
    const token = generateToken(user._id);

    console.log(`[REGISTER LEADER] Created Team "${team.team_name}" (${team.team_code}) by ${user.name}`);

    res.status(201).json({
      success: true,
      token,
      team_code: team.team_code,
      team_name: team.team_name,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college_name: user.college_name,
        year_of_study: user.year_of_study,
        is_team_leader: user.is_team_leader,
        team_id: user.team_id
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register Team Member & Join Existing Team by Team Code
 * @route   POST /api/auth/register/member
 */
export const registerMember = async (req, res, next) => {
  try {
    const { name, email, phone, college_name, year_of_study, team_code } = req.body;

    // 1. Validation
    if (!name || !email || !phone || !college_name || !year_of_study || !team_code) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields (name, email, phone, college_name, year_of_study, team_code).'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const formattedCode = team_code.trim().toUpperCase();

    // 2. Check duplicate email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User email is already registered.'
      });
    }

    // 3. Find Team by team_code
    const team = await Team.findOne({ team_code: formattedCode });
    if (!team) {
      return res.status(404).json({
        success: false,
        error: `Invalid team code '${formattedCode}'. No team found.`
      });
    }

    // 4. Check team member capacity
    const currentMemberCount = await User.countDocuments({ team_id: team._id });
    if (currentMemberCount >= team.max_members) {
      return res.status(400).json({
        success: false,
        error: `Team '${team.team_name}' is already full (Max ${team.max_members} members allowed).`
      });
    }

    // 5. Create Team Member User
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      college_name: college_name.trim(),
      year_of_study: year_of_study.trim(),
      is_team_leader: false,
      team_id: team._id
    });

    // 6. Generate Token
    const token = generateToken(user._id);

    console.log(`[REGISTER MEMBER] User ${user.name} joined Team "${team.team_name}" (${team.team_code})`);

    res.status(201).json({
      success: true,
      token,
      team_name: team.team_name,
      team_code: team.team_code,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college_name: user.college_name,
        year_of_study: user.year_of_study,
        is_team_leader: user.is_team_leader,
        team_id: user.team_id
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login Team Leader with Email & College Name
 * @route   POST /api/auth/login/leader
 */
export const loginLeader = async (req, res, next) => {
  try {
    const { email, college_name } = req.body;

    if (!email || !college_name) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both Leader Email and College Name.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedCollege = college_name.trim();

    // 1. Find User by Email & College Name
    const user = await User.findOne({
      email: normalizedEmail,
      college_name: { $regex: new RegExp(`^${trimmedCollege}$`, 'i') }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No registered Team Leader found matching this Email address and College name.'
      });
    }

    if (!user.is_team_leader) {
      return res.status(401).json({
        success: false,
        error: 'This email belongs to a Team Member, not a Team Leader.'
      });
    }

    // 2. Find Team
    const team = await Team.findById(user.team_id);
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team details not found for this leader.'
      });
    }

    // 3. Generate Token
    const token = generateToken(user._id);

    console.log(`[LOGIN SUCCESS] Leader ${user.name} logged in with email ${user.email} and college ${user.college_name}`);

    res.status(200).json({
      success: true,
      message: 'Login successful. Welcome back, Leader!',
      token,
      team_code: team.team_code,
      team_name: team.team_name,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college_name: user.college_name,
        year_of_study: user.year_of_study,
        is_team_leader: user.is_team_leader,
        team_id: user.team_id
      }
    });
  } catch (error) {
    next(error);
  }
};
