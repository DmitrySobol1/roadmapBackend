import express from 'express';
import mongoose from 'mongoose';
import UserModel from './models/user.js';

import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();


// import https from 'https';
// const baseurl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

const PORT = process.env.PORT || 4444;

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('db error:', err));

const app = express();

app.use(express.json());
app.use(cors());



app.get('/api', (req, res) => {
  res.send('hello man 6');
});



// вход пользователя в аппку
app.post('/api/enter', async (req, res) => {
    try {
      const user = await UserModel.findOne({ tlgid: req.body.tlgid });
  
      //создание юзера
      if (!user) {
        await createNewUser(req.body.tlgid);
        return res.json({ result: 'created' });
      }
  
      // извлечь инфо о юзере из БД и передать на фронт действие
      const { _id, ...userData } = user._doc;
      userData.result = 'showRoadmap'

      // if (user._doc.isOnboarded == false) {
      //    userData.result = 'showOnboarding'
      // } else {
      //   userData.result = 'showRoadmap'
      // }
      
      return res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'ошибка сервера',
      });
    }
  });





  async function createNewUser(tlgid) {
    try {
      const doc = new UserModel({
        tlgid: tlgid,
        isOnboarded: false,
        isMemberEdChannel: null,
        jb_email: null,
        isLevelTested: false,
        level: null,
      });
  
      const user = await doc.save();
    } catch (err) {
      console.log(err);
    }
  }






app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('server has been started');
});

