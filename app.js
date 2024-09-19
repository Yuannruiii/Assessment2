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

//get all fundraisers(所有信息)
app.get('/fundraisers',(req, res)=>{
	const query = `
	SELECT FUNDRAISER.*, CATEGORY.NAME AS CATEGORY_NAME
    FROM FUNDRAISER
    JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID = CATEGORY.CATEGORY_ID
    WHERE FUNDRAISER.ACTIVE = true
	`;

	connection.query(query, (error, results) => {
		if (error) {
			res.status(500).send('Database query failed');
		} else {
			res.json(results);
		}
	});
});

//get categories(获取人物)
app.get('/categories', (req, res) => {
	const category = req.query.category;
	const city = req.query.city;

	let query = `
	SELECT FUNDRAISER.*, CATEGORY.NAME AS CATEGORY_NAME 
    FROM FUNDRAISER 
    JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID = CATEGORY.CATEGORY_ID 
    WHERE FUNDRAISER.ACTIVE = true
    `;

    if (category) {
    	query += `AND CATEGORY.NAME = '${category}'`;
    }

    if (city) {
    	query += `AND FUNDRAISER.CITY = '${city}'`;
    }

    connection.query(query, (error, results) => {
    	if (error) {
    		res.status(500).send('Database query failed');
    	} else {
    		res.json(results);
    	}
    });
});

//GET fundraiser by ID（查询）
app.get('/fundraiser/:id',(req, res) => {
	const fundraiserID = req.params.id;
	const query = `
	SELECT FUNDRAISER.*, CATEGORY.NAME AS CATEGORY_NAME 
    FROM FUNDRAISER 
    JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID = CATEGORY.CATEGORY_ID 
    WHERE FUNDRAISER.FUNDRAISER_ID = ?
    `;

    connection.query(query, [fundraiserID], (error, results) => {
    	if (error) {
    		res.status(500).send('Database query failed');
    	} else {
    		res.json(results[0]);
    	}
    });
});

//Static files
app.use(express.static(path.join(__dirname, 'public')));

//Homepage
app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,"index.html"));
});

//search
app.get('/search',(req,res)=>{
  res.sendFile(path.join(__dirname,"search.html"));
});

//server
app.listen(4000,()=>{
	console.log("Server is running in 4000");
});