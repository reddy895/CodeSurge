import Team from '../models/Team.js';

/**
 * Generates a unique 6-character alphanumeric uppercase team code.
 * Checks Team collection to prevent collisions.
 */
export const generateTeamCode = async () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let isUnique = false;
  let code = '';

  while (!isUnique) {
    code = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    const existingTeam = await Team.findOne({ team_code: code });
    if (!existingTeam) {
      isUnique = true;
    }
  }

  return code;
};
