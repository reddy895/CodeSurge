import Team from '../models/Team.js';
import User from '../models/User.js';

/**
 * @desc    Get All Registered Teams with Leader & Members
 * @route   GET /api/admin/teams
 */
export const getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.find().sort({ created_at: -1 });

    const formattedTeams = await Promise.all(
      teams.map(async (team) => {
        const leaderUser = await User.findById(team.created_by).select('name email phone');
        const membersList = await User.find({ team_id: team._id }).select('name email phone is_team_leader');

        const leader = leaderUser
          ? { name: leaderUser.name, email: leaderUser.email, phone: leaderUser.phone }
          : { name: 'N/A', email: 'N/A', phone: 'N/A' };

        const members = membersList.map((m) => ({
          name: m.name,
          email: m.email,
          phone: m.phone
        }));

        return {
          _id: team._id,
          team_name: team.team_name,
          team_code: team.team_code,
          leader,
          members,
          total_members: members.length,
          created_at: team.created_at
        };
      })
    );

    res.status(200).json(formattedTeams);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export All Teams Data as CSV Download
 * @route   GET /api/admin/export/csv
 */
export const exportTeamsCSV = async (req, res, next) => {
  try {
    const teams = await Team.find().sort({ created_at: -1 });

    const rows = [];
    rows.push(['Team Name', 'Team Code', 'Leader Name', 'Leader Email', 'Leader Phone', 'Members', 'Total Members', 'Created At']);

    for (const team of teams) {
      const leaderUser = await User.findById(team.created_by);
      const membersList = await User.find({ team_id: team._id });

      const leaderName = leaderUser ? leaderUser.name : 'N/A';
      const leaderEmail = leaderUser ? leaderUser.email : 'N/A';
      const leaderPhone = leaderUser ? leaderUser.phone : 'N/A';

      const memberNames = membersList.map(m => m.name).join('; ');
      const totalMembers = membersList.length;
      const createdAt = new Date(team.created_at).toISOString();

      rows.push([
        `"${team.team_name.replace(/"/g, '""')}"`,
        `"${team.team_code}"`,
        `"${leaderName.replace(/"/g, '""')}"`,
        `"${leaderEmail.replace(/"/g, '""')}"`,
        `"${leaderPhone.replace(/"/g, '""')}"`,
        `"${memberNames.replace(/"/g, '""')}"`,
        totalMembers,
        `"${createdAt}"`
      ]);
    }

    const csvString = rows.map(r => r.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="hackathon_teams.csv"');
    res.status(200).send(csvString);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Hackathon Overall Statistics
 * @route   GET /api/stats
 */
export const getStats = async (req, res, next) => {
  try {
    const total_teams = await Team.countDocuments();
    const total_participants = await User.countDocuments();

    const average_team_size = total_teams > 0
      ? Number((total_participants / total_teams).toFixed(2))
      : 0;

    res.status(200).json({
      success: true,
      total_teams,
      total_participants,
      average_team_size
    });
  } catch (error) {
    next(error);
  }
};
