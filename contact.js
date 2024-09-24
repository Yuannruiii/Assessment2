document.addEventListener('DOMContentLoaded',()=>{
  const urlParams=new URLSearchParams(window.location.search);
  const fundraiserID=urlParams.get('id');

  if (fundraiserID){
    fetch(`/fundraiser/${fundraiserID}`)
      .then(response=>response.json())
      .then(fundraiser=>displayFundraiserDetails(fundraiser))
      .catch(error=>console.error('Error fetching fundraiser details:',error));
  }else{
    console.error('No fundraiser ID provided in the URL');
  }
});

function displayFundraiserDetails(fundraiser){
  const fundraiserDiv=document.getElementById('fundraiser-details');
  fundraiserDiv.innerHTML=`
    <h2>${fundraiser.CAPTION}</h2>
    <p><strong>Organiser:</strong>${fundraiser.ORGANIZER}</p>
    <p><strong>Target Funding:</strong>${fundraiser.TARGET_FUNDING} AUD</p>
    <p><strong>Current Funding:</strong>${fundraiser.CURRENT_FUNDING} AUD</p>
    <p><strong>City:</strong>${fundraiser.CITY}</p>
    <p><strong>Category:</strong>${fundraiser.CATEGORY_NAME}</p>
    <button id="donateButton">Donate</button>
  `;

  document.getElementById('donateButton').addEventListener('click',()=>{
    alert('This feature is under construction');
  });
}