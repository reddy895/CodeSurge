import Team from '../models/Team.js';
import User from '../models/User.js';

/**
 * @desc    Get Current User's Team Details & Members
 * @route   GET /api/teams/my-team
 * @access  Protected
 */
export const getMyTeam = async (req, res, next) => {
  try {
    if (!req.user.team_id) {
      return res.status(404).json({
        success: false,
        error: 'You are not assigned to any team yet.'
      });
    }

    const team = await Team.findById(req.user.team_id);
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found.'
      });
    }

    // Find Leader
    const leaderUser = await User.findById(team.created_by).select('name email phone college_name year_of_study');

    // Find Members
    const allMembers = await User.find({ team_id: team._id })
      .select('name email phone college_name year_of_study is_team_leader created_at')
      .sort({ is_team_leader: -1, created_at: 1 });

    const leader = leaderUser
      ? { name: leaderUser.name, email: leaderUser.email, phone: leaderUser.phone }
      : { name: 'Unknown', email: 'N/A', phone: 'N/A' };

    const members = allMembers.map(member => ({
      _id: member._id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      college_name: member.college_name,
      year_of_study: member.year_of_study,
      is_team_leader: member.is_team_leader
    }));

    res.status(200).json({
      success: true,
      team: {
        _id: team._id,
        team_name: team.team_name,
        team_code: team.team_code,
        max_members: team.max_members,
        leader,
        members,
        total_members: members.length,
        created_at: team.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Public Verification Endpoint for Hackathon Department (QR Code Scanning)
 * @route   GET /api/teams/verify/:team_code
 * @access  Public
 */
export const verifyTeam = async (req, res, next) => {
  try {
    const { team_code } = req.params;
    const formattedCode = team_code.trim().toUpperCase();

    const team = await Team.findOne({ team_code: formattedCode });
    if (!team) {
      return res.status(404).json({
        success: false,
        verified: false,
        error: `Team with code '${formattedCode}' not found. Invalid registration pass.`
      });
    }

    const leaderUser = await User.findById(team.created_by).select('name email phone college_name year_of_study');

    const members = await User.find({ team_id: team._id })
      .select('name email phone college_name year_of_study is_team_leader created_at')
      .sort({ is_team_leader: -1, created_at: 1 });

    const leader = leaderUser
      ? {
          name: leaderUser.name,
          email: leaderUser.email,
          phone: leaderUser.phone,
          college_name: leaderUser.college_name,
          year_of_study: leaderUser.year_of_study
        }
      : { name: 'Unknown', email: 'N/A', phone: 'N/A', college_name: 'N/A', year_of_study: 'N/A' };

    res.status(200).json({
      success: true,
      verified: true,
      team_name: team.team_name,
      team_code: team.team_code,
      college_name: leader.college_name,
      leader,
      members: members.map(m => ({
        name: m.name,
        email: m.email,
        phone: m.phone,
        college_name: m.college_name,
        year_of_study: m.year_of_study,
        is_team_leader: m.is_team_leader
      })),
      total_members: members.length,
      created_at: team.created_at
    });
  } catch (error) {
    next(error);
  }
};
