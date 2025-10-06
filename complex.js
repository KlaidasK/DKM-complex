const WorkoutStatus = require('./models/WorkoutStatus');

/**
 * Get workout completions for a user over a period
 * @param {String} username - User's username
 * @param {String} period - "weekly" or "monthly"
 * @returns {Object} - { success: Boolean, labels: [], data: [], total: Number, topWorkout: String } or error
 */
async function getWorkoutCompletions(username, period) {
  if (!username || !period) {
    return { success: false, status: 400, error: 'Username and period are required' };
  }

  let dateRange;
  const now = new Date();

  switch (period.toLowerCase()) {
    case 'weekly':
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      dateRange = { $gte: oneWeekAgo };
      break;
    case 'monthly':
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 1);
      dateRange = { $gte: oneMonthAgo };
      break;
    default:
      return { success: false, status: 400, error: 'Invalid period. Use "weekly" or "monthly"' };
  }

  try {
    const workoutStatuses = await WorkoutStatus.find({
      username,
      date: dateRange,
      status: 'Yes',
    })
      .populate('workoutId', 'name')
      .exec();

    if (!workoutStatuses || workoutStatuses.length === 0) {
      return { success: false, status: 404, error: 'No workout data found for the specified period' };
    }

    // Count completions
    const workoutCounts = workoutStatuses.reduce((counts, ws) => {
      const name = ws.workoutId.name;
      counts[name] = (counts[name] || 0) + 1;
      return counts;
    }, {});

    const labels = Object.keys(workoutCounts);
    const data = Object.values(workoutCounts);
    const total = data.reduce((sum, val) => sum + val, 0);

    // Find most performed workout
    const topWorkout = labels[data.indexOf(Math.max(...data))] || null;

    return {
      success: true,
      labels,
      data,
      total,
      topWorkout,
    };
  } catch (err) {
    console.error(err);
    return { success: false, status: 500, error: 'Server error while fetching workout data' };
  }
}

module.exports = { getWorkoutCompletions };
