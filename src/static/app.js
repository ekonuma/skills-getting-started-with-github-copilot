document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        renderActivityCard(name, details);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Render individual activity card
  function renderActivityCard(activityName, activityData) {
    const card = document.createElement("div");
    card.className = "activity-card";

    // Título e descrição
    const title = document.createElement("h4");
    title.textContent = activityName;
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = activityData.description;
    card.appendChild(desc);

    const schedule = document.createElement("p");
    schedule.innerHTML = `<strong>Horário:</strong> ${activityData.schedule}`;
    card.appendChild(schedule);

    // Seção de participantes
    const participantsSection = document.createElement("div");
    participantsSection.className = "participants-section";

    const participantsTitle = document.createElement("h5");
    participantsTitle.textContent = "Participantes:";
    participantsSection.appendChild(participantsTitle);

    const participantsList = document.createElement("ul");
    participantsList.className = "participants-list";

    if (activityData.participants && activityData.participants.length > 0) {
      activityData.participants.forEach((email) => {
        const li = document.createElement("li");
        li.textContent = email;
        participantsList.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "Nenhum participante ainda.";
      participantsList.appendChild(li);
    }

    participantsSection.appendChild(participantsList);
    card.appendChild(participantsSection);

    activitiesList.appendChild(card);
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
