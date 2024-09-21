document.addEventListener('DOMContentLoaded',()=>{
  const queryString=window.location.search;
  const urlParams=new URLSearchParams(queryString);
  const fundraiserId=urlParams.get('id');

  if (fundraiserId){
    fetchFundraiserDetails(fundraiserId);
  }else{
    document.getElementById('fundraiser-details').innerHTML='Fundraiser not found';
  }
});

function fetchFundraiserDetails(id){
  fetch(`/fundraiser/${id}`)
    .then(response=>response.json())
    .then(data=>displayFundraiserDetails(data))
    .catch(error=>console.error('Error fetching fundraiser details:', error));
}

function displayFundraiserDetails(fundraiser){
  const detailsSection=document.getElementById('fundraiser-details');

  const caption=document.createElement('h2');
  caption.textContent=fundraiser.CAPTION;

  const organizer=document.createElement('p');
  organizer.textContent=`Organizer: ${fundraiser.ORGANIZER}`;

  const city=document.createElement('p');
  city.textContent=`City: ${fundraiser.CITY}`;

  const category=document.createElement('p');
  category.textContent=`Category: ${fundraiser.CATEGORY_NAME}`;

  const funding=document.createElement('p');
  funding.textContent=`Current Funding: ${fundraiser.CURRENT_FUNDING}/Target:${fundraiser.TARGET_FUNDING}`;

  const active=document.createElement('p');
  active.textContent=`Active:${fundraiser.ACTIVE?'Yes':'No'}`;

  detailsSection.appendChild(caption);
  detailsSection.appendChild(organizer);
  detailsSection.appendChild(city);
  detailsSection.appendChild(category);
  detailsSection.appendChild(funding);
  detailsSection.appendChild(active);
}

document.getElementById('donateButton').addEventListener('click',()=>{
  alert('This feature is under construction');
});