// Step 1: Call this when page loads
window.onload = function () {
  fetchUserProfile();
};

// Step 2: Fetch profile data
async function fetchUserProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    document.querySelector(".container").innerHTML =
      "<p style='color:red;'>Token missing. Please log in again.</p>";
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/user/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    const data = await response.json();
    const user = data.user;

    // Set only what exists in HTML
    document.getElementById("name").innerText = user.name || "N/A";
    document.getElementById("email").innerText = user.email || "N/A";

  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    document.querySelector(".container").innerHTML =
      "<p style='color:red;'>Error loading profile. Please log in again.</p>";
  }
}

// Step 3: Logout function
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}
