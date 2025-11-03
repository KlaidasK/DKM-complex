 async function displayProgress(goal) {
            // Check if goal is weight-related
            if (goal === "Lose weight" || goal === "Gain weight") {
                const userData = await fetchUserData();
                const latestWeightData = await fetchLatestWeight();
        
                if (userData && latestWeightData) {
                    const initialWeight = userData.weight;
                    const latestWeight = latestWeightData.weight;
                    let progressMessage = "";
        
                    if (goal === "Lose weight") {
                        const progress = initialWeight - latestWeight;
                        progressMessage = `Initial Weight: ${initialWeight}kg, Latest Weight: ${latestWeight}kg, Progress: ${
                            progress > 0 ? `${progress}kg lost` : "No progress yet"
                        }.`;
                    } else if (goal === "Gain weight") {
                        const progress = latestWeight - initialWeight;
                        progressMessage = `Initial Weight: ${initialWeight}kg, Latest Weight: ${latestWeight}kg, Progress: ${
                            progress > 0 ? `${progress}kg gained` : "No progress yet"
                        }.`;
                    }
        
                    if (progressMessage) {
                        progressSection.style.display = "block";
                        progressText.textContent = progressMessage;
                    } else {
                        progressSection.style.display = "none";
                    }
                } else {
                    progressSection.style.display = "none";
                }
            }
            
            // Check if goal is to increase step count
            else if (goal === "Increase step count") {
                try {
                    const response = await fetch(`/get-step-progress?username=${username}`);
        
                    if (!response.ok) {
                        throw new Error('Failed to fetch step progress');
                    }
        
                    const data = await response.json();
        
                    if (data.success) {
                        const { initialSteps, latestSteps, progress } = data;
        
                        // Show the step progress message
                        progressSection.style.display = "block";
                        progressText.textContent = `Initial Steps: ${initialSteps}, Latest Steps: ${latestSteps}, Progress: ${
                            progress > 0 ? `${progress} steps increased` : `${Math.abs(progress)} steps decreased`
                        }.`;
                    } else {
                        progressSection.style.display = "none";
                        console.error("No step data found:", data.error || data.message);
                    }
                } catch (error) {
                    console.error("Error displaying step progress:", error);
                    progressSection.style.display = "none";
                }
            }
        
                    // Check if goal is related to calorie intake
            else if (goal === "Track daily calories") {
                try {
                    const response = await fetch(`/get-calories-intake?username=${username}`);

                    if (!response.ok) {
                        throw new Error('Failed to fetch calorie intake data');
                    }

                    const data = await response.json();

                    if (data.success) {
                        const { calorieGoal, initialCalories, latestCalories, progress } = data;

                        // Prepare the progress message
                        let progressMessage = `Initial Calories: ${initialCalories} kcal, Latest Calories: ${latestCalories} kcal, Progress: ${
                            progress > 0 ? `${progress} kcal` : `${Math.abs(progress)} calorie progress`
                        }.`;

                        // Display the progress message
                        progressSection.style.display = "block";
                        progressText.textContent = progressMessage;
                    } else {
                        progressSection.style.display = "none";
                        console.error("No calorie data found:", data.error || data.message);
                    }
                } catch (error) {
                    console.error("Error displaying calorie progress:", error);
                    progressSection.style.display = "none";
                }
            }

            else if (goal === "Increase fitness (workout repetition)") {
                try {
                    const response = await fetch(`/get-workout-progress?username=${username}`);
            
                    if (!response.ok) {
                        throw new Error('Failed to fetch workout progress data');
                    }
            
                    const data = await response.json();
            
                    if (data.success) {
                        const { averageWorkoutsPerWeek, totalCompletedWorkouts, startDate, endDate } = data;
            
                        // Prepare the progress message
                        let progressMessage = `Total completed Workouts: ${totalCompletedWorkouts}, Completed workouts per Week: ${averageWorkoutsPerWeek}, `;
            
                        // Display the progress message
                        progressSection.style.display = "block";
                        progressText.textContent = progressMessage;
                    } else {
                        progressSection.style.display = "none";
                        console.error("No workout data found:", data.error || data.message);
                    }
                } catch (error) {
                    console.error("Error displaying workout progress:", error);
                    progressSection.style.display = "none";
                }
            }
            

        
            // Hide the progress section if no valid goal
            else {
                progressSection.style.display = "none";
            }
        }
        
