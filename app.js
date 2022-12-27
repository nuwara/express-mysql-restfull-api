const express = require("express");
const mysql = require("mysql");

// creating connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "productdb"   //comment this line 4d first b4 the db is created
});

db.connect(err=>{
    if(err){
        console.log(err);
    }else{
        console.log("mysql db connected");
    }

    // creating DB
    db.query("CREATE DATABASE IF NOT EXISTS productdb", err=>{
        if(err){
            console.log(err);
        }else{ 
            console.log("MySQL Database created");
        }
    });

    // create Table
    const sql = "CREATE TABLE IF NOT EXISTS productTable(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), model VARCHAR(255), description VARCHAR(255), price VARCHAR(255))";
    db.query(sql, err=>{
        if(err){
            console.log(err);
        }else{
            console.log("MySQL Table created");
        }
    });
});


// initializing express app
const app = express();

// middleware
app.use(express.urlencoded({extended: true}));

// ########################### multiple records routes ###############################
app.route("/products")
.get((req, res)=>{
    const sql = "SELECT * FROM productTable ORDER By id desc";
    db.query(sql, (err, products)=>{
        if(products){
            res.send(products);
        }else{
            res.send("No record is available");
        }
    });
})
.post((req, res)=>{
    const name = req.body.name;
    const model = req.body.model;
    const description = req.body.description;
    const price = req.body.price;
  
    // console.log(req.body);

    const sql = `INSERT INTO productTable(name, model, description, price) VALUES("${name}", "${model}", "${description},", "${price}")`;
    db.query(sql, err=>{
        if(err){
            res.send(err);
        }else{
            res.send("Record added successfully");
        }
    });
});

// ###################### specific record routes #############################
app.route("/product/:id")
.get((req, res)=>{
    // console.log(req.params.id);

    const myId = req.params.id;
    const sql = `SELECT * FROM productTable WHERE id = "${myId}"`;
    db.query(sql, (err, product)=>{
        if(product){
            res.send(product);
        }else{
            res.send("Record with this id is not available");
        }
    });
})
.put((req, res)=>{
    const id = req.params.id;
    const newUpdate = req.body;
    const sql = "UPDATE productTable SET ? WHERE id = ?"
    db.query(sql, [newUpdate, id], err=>{
        if(err){
            res.send(err);
        }else{
            res.send("Record updated");
        }
    });
})
.delete((req, res)=>{
    const myId = req.params.id;
    const sql = `DELETE FROM productTable WHERE id = "${myId}"`;
    db.query(sql, err=>{
        if(err){
            res.send(err);
        }else{
            res.send("Record deleted successfully");
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`Server started on port ${port}`));