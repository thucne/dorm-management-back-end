const express = require('express');
const morgan = require('morgan');
const cors = require('cors');



const connectMongoDB = require('./config/DB')
    //const productRoute = require('./routes/productRoute')
    // init app
const app = express()

app.use(cors());

//config environment variables path to './'
require('dotenv').config()


app.use(morgan('dev'))

// routes
app.use(express.json());
app.use('/admin', require('./routes/admin.js'));
app.use('/student', require('./routes/student.js'));
app.use('/room', require('./routes/room.js'));
//app.use('/bill',require('./routes/bill.js'));
app.use('/utilitybill', require('./routes/utilitybill.js'));
app.use('/requestfix', require('./routes/requestfix.js'));
app.use('/requestreturn', require('./routes/requestreturn.js'));
app.use('/notification', require('./routes/notification.js'));



//connect database
connectMongoDB();

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
})