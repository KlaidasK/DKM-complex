// Save workout status for a user
app.post('/save-workout-status', async (req, res) => {
  const { username, updatedWorkouts } = req.body;

  try {
    // Create a new workout status entry
    const newStatus = new WorkoutStatus({
      username,
      workoutId,
      status,
      date: new Date() // Default to the current date
    });

    // Save the new status
    await newStatus.save();

    res.status(200).json({ success: true, message: 'Workout status saved successfully.' });
  } catch (error) {
    console.error('Error saving workout status:', error);
    res.status(500).json({ error: 'Error saving workout status', details: error.message });
  }
});

app.get('/get-workout-completions', async (req, res) => {
  const { username, period } = req.query;

  if (!username || !period) {
    return res.status(400).json({ success: false, error: 'Username and period are required' });
  }

  try {
    let dateRange;

    // Determine the date range based on the period (weekly or monthly)
    if (period === 'weekly') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      dateRange = { $gte: oneWeekAgo };
    } else if (period === 'monthly') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      dateRange = { $gte: oneMonthAgo };
    } else {
      return res.status(400).json({ success: false, error: 'Invalid period' });
    }

    // Fetch the workout status data with `status: 'Yes'` and populate the workout details
    const workoutStatuses = await WorkoutStatus.find({
      username: username,
      date: dateRange,
      status: 'Yes', // Include only workouts marked as completed (status = "Yes")
    })
      .populate('workoutId', 'name') // Populate workout name
      .exec();

    if (!workoutStatuses || workoutStatuses.length === 0) {
      return res.status(404).json({ success: false, error: 'No workout data found for the specified period' });
    }

    // Count the completions of each workout
    const workoutCounts = workoutStatuses.reduce((counts, workoutStatus) => {
      const workoutName = workoutStatus.workoutId.name; // Access the populated workout name
      if (!counts[workoutName]) {
        counts[workoutName] = 0;
      }
      counts[workoutName]++;
      return counts;
    }, {});

    // Prepare the data for the chart
    const labels = Object.keys(workoutCounts);
    const data = Object.values(workoutCounts);

    return res.json({
      success: true,
      labels: labels,
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Error fetching workout completion data' });
  }
});
