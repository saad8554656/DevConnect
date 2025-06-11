const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDb = require('./config/db');
const cookieParser = require('cookie-parser');
const path = require('path');


const app = express()
dotenv.config();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
connectDb();


app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/posts', require('./routes/post'));
app.use('/api/admin' , require('./routes/admin'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.listen(process.env.PORT || 5000,() =>{
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
    
})