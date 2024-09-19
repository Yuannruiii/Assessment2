// Fetch active fundraisers
document.addEventListener('DOMContentLoaded',()=>{
  fetch('/fundraisers')
    .then(response=>response.json())
    .then(data=>displayFundraisers(data))
    .catch(error=>console.error('Error fetching fundraisers:',error));
});

//fundraisers on the page
function displayFundraisers(fundraisers){
  const fundraiserList=document.getElementById('fundraiser-list');

  fundraisers.forEach(fundraiser=>{
    const fundraiserDiv=document.createElement('div');
    fundraiserDiv.className='fundraiser';

    fundraiserDiv.innerHTML=`
      <h3>${fundraiser.CAPTION}</h3>
      <p><strong>Organiser:</strong> ${fundraiser.ORGANIZER}</p>
      <p><strong>Target Funding:</strong> ${fundraiser.TARGET_FUNDING}AUD</p>
      <p><strong>Current Funding:</strong> ${fundraiser.CURRENT_FUNDING}AUD</p>
      <p><strong>City:</strong> ${fundraiser.CITY}</p>
      <p><strong>Category:</strong> ${fundraiser.CATEGORY_NAME}</p>
      <p><strong>Active:</strong> ${fundraiser.ACTIVE ?'Yes':'No'}</p>
    `;

    fundraiserList.appendChild(fundraiserDiv);
  });
}

//search
document.getElementById('searchButton').addEventListener('click',()=>{
  const organizer=document.getElementById('organizer').value;
  const city=document.getElementById('city').value;
  const category=document.getElementById('category').value;

  // 确保至少选择一个条件
  if (!organizer && !city && !category) {
    alert('Please select at least one search criteria.');
    return;
  }

  // 构建查询字符串
  let query='/search?';
  if (organizer) query+=`organizer=${organizer}&`;
  if (city) query+=`city=${city}&`;
  if (category) query+=`category=${category}`;

  // 调用 API 获取匹配的募资项目
  fetch(query)
    .then(response=>response.json())
    .then(data=>displayResults(data))
    .catch(error=>console.error('Error fetching fundraisers:',error));
});

// 显示搜索结果
function displayResults(fundraisers){
  const resultDiv=document.getElementById('result');
  const errorMessage=document.getElementById('errorMessage');
  resultDiv.innerHTML='';  // 清空之前的结果
  errorMessage.style.display='none';  // 隐藏错误信息

  if (fundraisers.length===0){
    errorMessage.style.display='block';  // 显示错误信息
    return;
  }

  // 展示每个募资项目
  fundraisers.forEach(fundraiser=>{
    const fundraiserLink=document.createElement('a');
    fundraiserLink.href=`/fundraiser/${fundraiser.FUNDRAISER_ID}`;
    fundraiserLink.textContent=fundraiser.CAPTION;

    const organizer=document.createElement('p');
    organizer.textContent=`Organizer: ${fundraiser.ORGANIZER}`;

    const city=document.createElement('p');
    city.textContent=`City: ${fundraiser.CITY}`;

    const category=document.createElement('p');
    category.textContent=`Category: ${fundraiser.CATEGORY_NAME}`;

    const funding=document.createElement('p');
    funding.textContent=`Current Funding: ${fundraiser.CURRENT_FUNDING}/Target: ${fundraiser.TARGET_FUNDING}`;

    const active=document.createElement('p');
    active.textContent=`Active: ${fundraiser.ACTIVE ?'Yes':'No'}`;

    const fundraiserDiv=document.createElement('div');
    fundraiserDiv.className='fundraiser';
    fundraiserDiv.appendChild(fundraiserLink);
    fundraiserDiv.appendChild(organizer);
    fundraiserDiv.appendChild(city);
    fundraiserDiv.appendChild(category);
    fundraiserDiv.appendChild(funding);
    fundraiserDiv.appendChild(active);

    resultDiv.appendChild(fundraiserDiv);
  });
}

// 清除输入框和选择框
function clearCheckboxes(){
  document.getElementById('organizer').value='';
  document.getElementById('city').value='';
  document.getElementById('category').value='';
}