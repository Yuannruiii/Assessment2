// Fetch active fundraisers
document.addEventListener('DOMContentLoaded', () => {
  fetch('/fundraisers')
    .then(response => response.json())
    .then(data => displayFundraisers(data))
    .catch(error => console.error('Error fetching fundraisers:', error));
});

//fundraisers on the page
function displayFundraisers(fundraisers) {
  const fundraiserList = document.getElementById('fundraiser-list');

  fundraisers.forEach(fundraiser => {
    const fundraiserDiv = document.createElement('div');
    fundraiserDiv.className = 'fundraiser';

    fundraiserDiv.innerHTML = `
      <h3>${fundraiser.CAPTION}</h3>
      <p><strong>Organiser:</strong> ${fundraiser.ORGANIZER}</p>
      <p><strong>Target Funding:</strong> ${fundraiser.TARGET_FUNDING} AUD</p>
      <p><strong>Current Funding:</strong> ${fundraiser.CURRENT_FUNDING} AUD</p>
      <p><strong>City:</strong> ${fundraiser.CITY}</p>
      <p><strong>Category:</strong> ${fundraiser.CATEGORY_NAME}</p>
      <p><strong>Active:</strong> ${fundraiser.ACTIVE ? 'Yes' : 'No'}</p>
    `;

    fundraiserList.appendChild(fundraiserDiv);
  });
}
