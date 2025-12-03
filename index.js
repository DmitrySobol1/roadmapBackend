import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

import UserModel from './models/user.js';
import CourseTypeModel from './models/courseType.js';
import CourseModel from './models/course.js';
import LessonModel from './models/lesson.js';
import UserProgressSchema from './models/userProgress.js';
import UserFavoriteLessons from './models/userFavoriteLessons.js';


const app = express();
const PORT = process.env.PORT || 4444;

// MongoDB connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API',
    status: 'Server is running',
  });
});

// ==========================================
// Получение данных из БД

app.get('/api/courseTypes', async (req, res) => {
  try {
    const courseTypes = await CourseTypeModel.find().sort({ orderNumber: 1 });
    res.json(courseTypes);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/courses/:typeId', async (req, res) => {
  try {
    const { typeId } = req.params;
    const courses = await CourseModel.find({ type: typeId })
      .populate('type')
      .sort({ orderNumber: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/lessons/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await LessonModel.find({ linkToCourse: courseId })
      .populate('linkToCourse')
      .sort({ numberInListLessons: 1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/lesson/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await LessonModel.findById(lessonId).populate('linkToCourse');
    if (!lesson) {
      return res.status(404).json({ status: 'error', message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/user/:tlgid', async (req, res) => {
  try {
    const { tlgid } = req.params;
    const user = await UserModel.findOne({ tlgid });
    if (!user) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });
    }
    res.json({ isPayed: user.isPayed || false });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ==========================================
// Прогресс пользователя

// Получить прогресс по уроку
app.get('/api/progress/:tlgid/:lessonId', async (req, res) => {
  try {
    const { tlgid, lessonId } = req.params;
    const progress = await UserProgressSchema.findOne({
      tlgid: tlgid,
      linkToLesson: lessonId
    });
    res.json({ isLearned: progress?.isLearned || false });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Сохранить прогресс (урок пройден)
app.post('/api/progress', async (req, res) => {
  try {
    const { tlgid, lessonId } = req.body;

    const existing = await UserProgressSchema.findOne({
      tlgid: tlgid,
      linkToLesson: lessonId
    });

    if (existing) {
      existing.isLearned = true;
      await existing.save();
      res.json({ status: 'updated', data: existing });
    } else {
      const progress = await UserProgressSchema.create({
        tlgid: tlgid,
        linkToLesson: lessonId,
        isLearned: true
      });
      res.json({ status: 'created', data: progress });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Удалить прогресс (урок не пройден)
app.delete('/api/progress/:tlgid/:lessonId', async (req, res) => {
  try {
    const { tlgid, lessonId } = req.params;
    await UserProgressSchema.deleteOne({
      tlgid: tlgid,
      linkToLesson: lessonId
    });
    res.json({ status: 'deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Получить прогресс по всем урокам курса
app.get('/api/progress/:tlgid/course/:courseId', async (req, res) => {
  try {
    const { tlgid, courseId } = req.params;

    // Получаем все уроки курса
    const lessons = await LessonModel.find({ linkToCourse: courseId });
    const lessonIds = lessons.map(l => l._id);

    // Получаем прогресс по этим урокам
    const progress = await UserProgressSchema.find({
      tlgid: tlgid,
      linkToLesson: { $in: lessonIds },
      isLearned: true
    });

    // Возвращаем массив id пройденных уроков
    const learnedLessonIds = progress.map(p => p.linkToLesson.toString());
    res.json({ learnedLessonIds });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ==========================================
// Избранные уроки

// Получить избранное по уроку
app.get('/api/favorite/:tlgid/:lessonId', async (req, res) => {
  try {
    const { tlgid, lessonId } = req.params;
    const favorite = await UserFavoriteLessons.findOne({
      tlgid: tlgid,
      linkToLesson: lessonId
    });
    res.json({ isFavorite: favorite?.isFavorite || false });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Добавить в избранное
app.post('/api/favorite', async (req, res) => {
  try {
    const { tlgid, lessonId } = req.body;

    const existing = await UserFavoriteLessons.findOne({
      tlgid: tlgid,
      linkToLesson: lessonId
    });

    if (existing) {
      existing.isFavorite = true;
      await existing.save();
      res.json({ status: 'updated', data: existing });
    } else {
      const favorite = await UserFavoriteLessons.create({
        tlgid: tlgid,
        linkToLesson: lessonId,
        isFavorite: true
      });
      res.json({ status: 'created', data: favorite });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Удалить из избранного
app.delete('/api/favorite/:tlgid/:lessonId', async (req, res) => {
  try {
    const { tlgid, lessonId } = req.params;
    await UserFavoriteLessons.deleteOne({
      tlgid: tlgid,
      linkToLesson: lessonId
    });
    res.json({ status: 'deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Получить все избранные уроки пользователя
app.get('/api/favorites/:tlgid', async (req, res) => {
  try {
    const { tlgid } = req.params;
    const favorites = await UserFavoriteLessons.find({
      tlgid: tlgid,
      isFavorite: true
    }).populate({
      path: 'linkToLesson',
      populate: {
        path: 'linkToCourse',
        populate: {
          path: 'type'
        }
      }
    });

    // Возвращаем только уроки (без обёртки favorites)
    const lessons = favorites
      .filter(f => f.linkToLesson) // Фильтруем записи без урока
      .map(f => f.linkToLesson);

    res.json(lessons);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ==========================================
// Создание информации в БД

app.post('/api/createCourse', async (req, res) => {
  try {
    const doc = await CourseModel.create({
      type: '692e144be7f57a4fd2e9ae28',
      name: 'Бэкенд для нон-кодеров',
      shortDescription: 'программа курса ...',
      longDescription: 'база по Node JS express. Это простой и популярная библиотека, на котором вы будете создавать бэкенд для своих приложений',
      access: 'payment',
      orderNumber: 4,
    });

    res.json({ status: 'done', data: doc });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/api/createLesson', async (req, res) => {
  try {
    const doc = await LessonModel.create({
      linkToCourse: '692f0cf34f6f72d335f8d75c',
      name: '6. Интеграция по API с любыми нейронками',

      shortDescription: 'short desc',
      longDescription: 'long desc',

      urlToFile: 'https://kinescope.io/vbqpZcuvC6cmcWRtUwKTnN',
      numberInListLessons: 6,
      access: 'payment'
    });

    res.json({ status: 'done', data: doc });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ===============================================

// вход пользователя в аппку
app.post('/api/enter', async (req, res) => {
  try {
    const { tlgid } = req.body;

    const user = await UserModel.findOne({ tlgid: tlgid });

    //создание юзера
    if (!user) {
      const createresponse = await createNewUser(tlgid);

      // if (!createresponse) {
      //   throw new Error('ошибка в функции createNewUser');
      // }

      if (createresponse.status == 'created') {
        const userData = {};
        console.log('showOnboarding');
        userData.result = 'showOnboarding';
        return res.json({ userData });
      }
    }

    // извлечь инфо о юзере из БД и передать на фронт действие
    const { _id, ...userData } = user._doc;
    userData.result = 'showIndexPage';
    console.log('showIndexPage');
    return res.json({ userData });
  } catch (err) {
    // logger.error({
    //       title: 'Error in endpoint /system/enter',
    //       message: err.message,
    //       dataFromServer: err.response?.data,
    //       statusFromServer: err.response?.status,
    //     });
  }
  return res.json({ statusBE: 'notOk' });
});

async function createNewUser(tlgid) {
  try {
    const doc = new UserModel({
      tlgid: tlgid,
    });

    const user = await doc.save();

    if (!user) {
      throw new Error('ошибка при создании пользователя в бд UserModel');
    }

    return { status: 'created' };
  } catch (err) {
    return false;
  }
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}`);
});
