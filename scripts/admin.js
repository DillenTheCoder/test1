document.addEventListener('DOMContentLoaded', async () => {
  const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbyjJ-7OiISqbYY8-BEjqNX5lUhMDMMwZGIsv40nOpLoU55yqi8GWE1wGr6pm9knBxc2/exec";
  const searchInput = document.getElementById("search");
  const memberList = document.getElementById("member-list");

  let allMembers = [];

  async function loadMembers() {
    try {
      const response = await fetch(SHEET_API_URL);
      allMembers = await response.json();
      renderMembers(allMembers);
    } catch (error) {
      console.error("Error loading members:", error);
      memberList.innerHTML = "<p>Error loading members. Please try again.</p>";
    }
  }

  function renderMembers(members) {
    if (members.length === 0) {
      memberList.innerHTML = "<p>No members found.</p>";
      return;
    }

    memberList.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Phone</th>
            <th>Email</th>
            <th>ID Number</th>
          </tr>
        </thead>
        <tbody>
          ${members.map(member => `
            <tr>
              <td>
                ${member.photo ? `<img src="${member.photo}" class="user-photo">` : 'No photo'}
              </td>
              <td>${member.name || ''}</td>
              <td>${member.surname || ''}</td>
              <td>${member.phone || ''}</td>
              <td title="${member.email || ''}">${member.email || ''}</td>
              <td>${member.id_number || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function filterMembers(query) {
    const filtered = allMembers.filter(member =>
      (member.name && member.name.toLowerCase().includes(query.toLowerCase())) ||
      (member.surname && member.surname.toLowerCase().includes(query.toLowerCase())) ||
      (member.id_number && member.id_number.includes(query))
    );
    renderMembers(filtered);
  }

  searchInput.addEventListener("input", (e) => {
    filterMembers(e.target.value);
  });

  loadMembers();
});