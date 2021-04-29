  import express from 'express';
  // import bodyParser from 'body-parser';
  import mongoose from 'mongoose';
  import cors from 'cors';
  import dotenv from 'dotenv';
  import cloudinary from 'cloudinary';
  import Student from './models/student.js';
  import Room from './models/room.js';
  import Bill from './models/bill.js';
  import Admin from './models/admin.js';
  import UtilityBill from './models/utilitybill.js';

  const app = express();


  dotenv.config();

  app.use(express.json({ limit: "150mb", extended: true }));
  app.use(express.urlencoded({ limit: "150mb", extended: true }));
  app.use(cors());

  app.get('/', async(req, res) => {
      try {
          //   const newStudent = {
          //       full_name: "Bibbie Wrathmall",
          //       identity_card: 892168756,
          //       dob: "3/4/2000",
          //       gender: "Male",
          //       academic_year: 3,
          //       field_of_major: "EE",
          //       folk: "Japanese",
          //       religion: "Catholicism",
          //       country: "Indonesia",
          //       insurance: {
          //           insurance_number: "SV8580003567330",
          //           dateofinsurance: "5/4/2021",
          //           validfrom: "8/4/2021",
          //           validto: "5/4/2022"
          //       },
          //       parentinfo: {
          //           parentname: "Ashlen",
          //           gender: "Male",
          //           address: "3748 Hallows Alley",
          //           phone: "+62 482 858 2410"
          //       },
          //       residentinfo: {
          //           provincecity: "Ho Chi Minh city",
          //           district: "Thu Duc",
          //           ward: "Linh Trung",
          //           email: "BibbieWrathmall@taobao.com",
          //           password: "XfBm2H",
          //           tel: "+44 304 633 1041"
          //       },
          //       stayindorm: {
          //           semester: "II",
          //           from: "1/6/2021",
          //           to: "1/1/2022",
          //           note: null
          //       },
          //   }
          //   const allData = new Student({...newStudent });
          //   await allData.save();
          const allData = await UtilityBill.find();
          res.status(200).json(allData);
      } catch (error) {
          res.status(404).json({ message: error.message })
      }

  });

  const PORT = process.env.PORT || 5000;

  mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
      .catch((error) => console.log(error.message));

  mongoose.set('useFindAndModify', false);