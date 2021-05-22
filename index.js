const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const connectMongoDB = require('./config/DB.js')
const app = express();
app.use('/room', require('./routes/room.js'));
app.use('/UtilityBill', require('./routes/UtilityBill.js'))

dotenv.config();

app.use(morgan('dev'))
app.use(express.json({ limit: "150mb", extended: true }));
app.use(express.urlencoded({ limit: "150mb", extended: true }));
app.use(bodyParser.json());
app.use(cors());

connectMongoDB();

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
})

// test thay đoi