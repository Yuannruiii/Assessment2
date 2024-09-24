document.addEventListener('DOMContentLoaded',()=>{
  fetch('/fundraisers')
  .then(response =>{
    const contentType=response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')){
      throw new TypeError("Ooohhh!!! we didn't get JSON!");
    }
    
    return response.json();
  })
  .then(data=>displayFundraisers(data))
  .catch(error=>{
    console.error('Error fetching fundraisers:',error);
    console.log('Full error response:',error);
  });
});

function displayFundraisers(fundraisers){
  const fundraiserList=document.getElementById('fundraiser-list');

  fundraisers.forEach(fundraiser=>{
    const fundraiserDiv=document.createElement('div');
    fundraiserDiv.className='fundraiser';

    fundraiserDiv.innerHTML=`
      <h3>${fundraiser.CAPTION}</h3>
      <p><strong>Organiser:</strong>${fundraiser.ORGANIZER}</p>
      <p><strong>Target Funding:</strong>${fundraiser.TARGET_FUNDING}AUD</p>
      <p><strong>Current Funding:</strong>${fundraiser.CURRENT_FUNDING}AUD</p>
      <p><strong>City:</strong>${fundraiser.CITY}</p>
      <p><strong>Category:</strong>${fundraiser.CATEGORY_NAME}</p>
      <p><strong>Active:</strong>${fundraiser.ACTIVE?'Yes':'No'}</p>
    `;

    fundraiserList.appendChild(fundraiserDiv);
  });
}

//search
document.getElementById('searchButton').addEventListener('click',()=>{
  const organizer=document.getElementById('organizer').value;
  const city=document.getElementById('city').value;
  const category=document.getElementById('category').value;

  if (!organizer&& !city && !category){
    alert('Please select at least one search criteria.');
    return;
  }

  let query='/api/search?';
  if (organizer) query+=`organizer=${organizer}&`;
  if (city) query+=`city=${city}&`;
  if (category) query+=`category=${category}`;

  fetch(query)
    .then(response=>{
      const contentType=response.headers.get('content-type');
      if (!contentType||!contentType.includes('application/json')){
        throw new TypeError("Oops, it is not JSON!");
      }

      if (!response.ok){
        throw new Error(`HTTP error!Status:${response.status}`);
      }

      return response.json();
    })
    .then(data=>{
      if (data.length===0) {
        console.log('No fundraisers found');
      }else{
        displayResults(data); 
      }
    })
    .catch(error=>{
      console.error('Error fetching fundraisers:',error);
      console.log('Full error response:',error);
    });
});

function displayResults(fundraisers) {
  const resultDiv=document.getElementById('result');
  resultDiv.innerHTML='';

  fundraisers.forEach(fundraiser=>{
    const fundraiserDiv=document.createElement('div');
    fundraiserDiv.className='fundraiser';

    const fundraiserLink=document.createElement('a');
    fundraiserLink.href=`/contact.html?id=${fundraiser.FUNDRAISER_ID}`;
    fundraiserLink.textContent=fundraiser.CAPTION;

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

    fundraiserDiv.appendChild(fundraiserLink);
    fundraiserDiv.appendChild(organizer);
    fundraiserDiv.appendChild(city);
    fundraiserDiv.appendChild(category);
    fundraiserDiv.appendChild(funding);
    fundraiserDiv.appendChild(active);

    resultDiv.appendChild(fundraiserDiv);
  });
}

function clearCheckboxes(){
  document.getElementById('organizer').value='';
  document.getElementById('city').value='';
  document.getElementById('category').value='';
}