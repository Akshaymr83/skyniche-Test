const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 4001;
const cors = require('cors');
const cookieParser =require('cookie-parser');

const fs = require('fs');
const userModel = require('./models/user');
mongoose.connect('mongodb://127.0.0.1/Skyniche')

  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(cookieParser());





app.post('/employee', upload.single('image'), async (req, res) => {
    try {
      const { firstname,lastname,designation,date,email,salary,department,ID} = req.body;
      const imagePath = req.file ? `images/${path.basename(req.file.path)}` : null; // Check if image was uploaded
      const newEmployee = await userModel.create({
      firstname,
      lastname,
        image: imagePath,
       designation,
       date,
       email,
       salary,
       department,ID
      });
      res.status(201).json({ employee: newEmployee });
      console.log('Employee added successfully:', newEmployee);
    } catch (error) {
      console.error('Error adding employee:', error);
      res.status(400).json({ error: error.message }); // Return specific error message
    }
  });
  
  
  app.get('/getEmployee',async(req,res)=>{
    try{
      const employee =await userModel.find();
      res.json({employee})
      
    }
    catch (err){
      res.status(500).json({err:err.message});
    }
  });
  
  app.delete('/deleteEmployee/:id',(req,res)=>{
    const {id} = req.params;
    userModel.findByIdAndDelete({_id:id})
    .then((de)=>{
      console.log(de);
      res.json(de)
    })
    .catch((err)=>{
      console.log(err);
    })
  })
  
  
  
  app.get("/getUserEmployee/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const employee = await userModel.findById(id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  // Update employee by ID
  app.put("/updateEmployee/:id", upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { firstname,lastname,designation,date,email,salary,department,ID} = req.body;
    let image = req.file ? `/images/${req.file.filename}` : null;
    try {
      const updatedEmployee = await userModel.findByIdAndUpdate(
        id,
        {   firstname,lastname,designation,date,email,salary,image,department},
        { new: true }
      );
      if (!updatedEmployee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(updatedEmployee);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

app.listen(port, () => {
    console.log('Server is running on port', port);
  });