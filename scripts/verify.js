document.addEventListener('DOMContentLoaded', () => {
  const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbx3yPiVDua65k-LZdBRBailTN8JrLpYIP9Flx09vvFYDvKmA2M7sclbkkaGIHnQWvK4zg/exec"; // Same as in main.js
  const searchInput = document.getElementById("search_id");
  const verifyButton = document.querySelector(".verify_button");
  const userInfoDiv = document.getElementById("user-info");

  verifyButton.addEventListener("click", async () => {
    const idNumber = searchInput.value.trim();
    
    if (idNumber.length !== 13 || isNaN(idNumber)) {
      alert("Please enter a valid 13-digit ID number");
      return;
    }

    try {
      const response = await fetch(SHEET_API_URL);
      const members = await response.json();
      const member = members.find(m => m.id_number === idNumber);

      if (member) {
        userInfoDiv.innerHTML = `
          <div class="user-details">
            ${member.photo ? `<img src="${member.photo}" class="user-photo">` : ''}
            <p><strong>Name:</strong> ${member.name || 'N/A'}</p>
            <p><strong>Surname:</strong> ${member.surname || 'N/A'}</p>
            <p><strong>Phone:</strong> ${member.phone || 'N/A'}</p>
            <p><strong>Email:</strong> ${member.email || 'N/A'}</p>
            <p><strong>ID Number:</strong> ${member.id_number || 'N/A'}</p>
          </div>
        `;
      } else {
        userInfoDiv.innerHTML = "<p>No member found with that ID number</p>";
      }
    } catch (error) {
      console.error("Error verifying member:", error);
      userInfoDiv.innerHTML = "<p>Error verifying membership. Please try again.</p>";
    }
  });
});