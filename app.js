const express=require('express');
const mysql=require('mysql2');
const app=express();
const port=4000;
const path=require('path');

const connection=mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"2002812918",
	database:"crowdfunding_db"
});


connection.connect(err=>{
	if(err){
		console.error('Error connecting to the database:'+err.stack);
		return;
	}
	console.log('Connected to the database');
});

app.get('/fundraisers',(req,res)=>{
  const query=`
    SELECT FUNDRAISER.*,CATEGORY.NAME AS CATEGORY_NAME
    FROM FUNDRAISER
    JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID=CATEGORY.CATEGORY_ID
    WHERE FUNDRAISER.ACTIVE=true
  `;

  connection.query(query,(error,results)=>{
    if (error){
      console.error('Database query failed:',error);
      return res.status(500).json({error:'Database query failed',details:error});
    }

    if (results.length===0){
      return res.status(404).json({message:'No active fundraisers found'});
    }
    
    res.json(results);
  });
});

app.get('/categories',(req,res)=>{
	const category=req.query.category;
	const city=req.query.city;

	let query=`
	SELECT FUNDRAISER.*,CATEGORY.NAME AS CATEGORY_NAME 
    FROM FUNDRAISER 
    JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID=CATEGORY.CATEGORY_ID 
    WHERE FUNDRAISER.ACTIVE=true
    `;

    if(category){
    	query+=`AND CATEGORY.NAME='${category}'`;
    }

    if(city){
    	query+=`AND FUNDRAISER.CITY='${city}'`;
    }

    connection.query(query,(error,results)=>{
    	if(error){
    		res.status(500).send('Database query failed');
    	}else{
    		res.json(results);
    	}
    });
});

app.get('/fundraiser/:id',(req,res)=>{
  const fundraiserID=req.params.id;

  console.log(`Fetching fundraiser with ID:${fundraiserID}`);

  const query=`
  SELECT FUNDRAISER.*,CATEGORY.NAME AS CATEGORY_NAME 
  FROM FUNDRAISER 
  JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID=CATEGORY.CATEGORY_ID 
  WHERE FUNDRAISER.FUNDRAISER_ID=?
  `;

  connection.query(query,[fundraiserID],(error,results)=>{
    if(error){
      console.error('Database query failed:',error);
      res.status(500).send('Database query failed');
    }else if(results.length>0){
      res.json(results[0]);
    }else{
      res.status(404).send('Fundraiser not found');
    }
  });
});

app.get('/api/search',(req,res)=>{
  const{organizer,city,category}=req.query;
  console.log(req.query);

  let query=`
    SELECT FUNDRAISER.*, CATEGORY.NAME AS CATEGORY_NAME
    FROM FUNDRAISER 
    JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID=CATEGORY.CATEGORY_ID
    WHERE FUNDRAISER.ACTIVE=true
  `;

  const conditions=[];
  if (organizer){
    conditions.push(`FUNDRAISER.ORGANIZER LIKE'%${organizer}%'`);
  }
  if (city){
    conditions.push(`FUNDRAISER.CITY LIKE'%${city}%'`);
  }
  if (category){
    conditions.push(`CATEGORY.NAME='${category}'`);
  }

  if (conditions.length>0){
    query+=`AND${conditions.join('AND')}`;
  }

  connection.query(query,(error,results)=>{
    if (error){
      return res.status(500).json({error:'Database query failed'});
    }

    res.json(results);
  });
});

// 静态文件托管
app.use(express.static(path.join(__dirname,"public")));

// 主页路由
app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname,"public","index.html"));
});

// 搜索页面路由
app.get('/search', (req, res)=>{
  res.sendFile(path.join(__dirname,"public","search.html"));
});

// 联系页面路由
app.get('/contact', (req, res)=>{
  res.sendFile(path.join(__dirname,"public","contact.html"));
});

// 启动服务器
app.listen(4000,()=>{
  console.log('Server is running on port 4000');
});