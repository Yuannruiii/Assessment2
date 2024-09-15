const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2002812918',
    database: 'crowdfunding_db'
});

connection.connect((err) => {
  if (err) {
    return console.error('error connecting: ' + err.stack);
  }
  console.log('connected as id ' + connection.threadId);
});

connection.query('SELECT * FROM FUNDRAISER', (error, results, fields) => {
  if (error) throw error; 
  console.log('FUNDRAISERS: ', results); 
});