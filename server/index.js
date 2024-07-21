const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();

const db = require('./db');
const menuRoutes = require('./routes/menu');

const port = process.env.PORT || 8080;

// 세션 스토어 설정
const sessionStore = new MySQLStore({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DATABASE,
  port: '3306',
  charset: 'utf8mb4',
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
});

// 세션 미들웨어 설정
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { secure: false },
});

const app = express();

// 데이터베이스 연결 확인
db.getConnection((err, connection) => {
  if (err) {
    console.error('mysql connection error :' + err);
  } else {
    console.info('mysql is connected successfully.');
    connection.release();
  }
});

// 미들웨어 설정
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(sessionMiddleware);

// 리액트 빌드 결과물 서빙
app.use(express.static(path.join(__dirname, '../build')));

// API 라우트 설정
app.use('/menu', menuRoutes);


// 기본 페이지 서빙
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});


// 모든 요청에 대해 리액트 애플리케이션의 기본 HTML 파일을 서빙
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
