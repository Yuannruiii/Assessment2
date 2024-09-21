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
	SELECT FUNDRAISER.*, CATEGORY.NAME AS CATEGORY_NAME 
    FROM FUNDRAISER 
    JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID = CATEGORY.CATEGORY_ID 
    WHERE FUNDRAISER.ACTIVE = true
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

//Static files
app.use(express.static(path.join(__dirname,"public")));

//Homepage
app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,"public","index.html"));
});

//search
app.get('/search',(req,res)=>{
  res.sendFile(path.join(__dirname,"public","search.html"));
});

//detail
app.get('/contact',(req,res)=>{
  res.sendFile(path.join(__dirname,"public","contact.html"));
});

//server
app.listen(port,()=>{
	console.log(`Server is running on port ${port}`);
})