import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import router from "./src/router/index.js";
import cors from 'cors';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json({
    limit : '50mb'
}));

const allowedOrigins = ["http://localhost:3000"]; // 허용할 도메인을 배열로 지정

app.use(
  cors({
    origin: allowedOrigins, // allowedOrigins 배열에 있는 도메인만 허용
    credentials: true, // 인증 정보(쿠키 등)를 요청에 포함
    exposedHeaders: ["Authorization"], // 노출할 헤더 설정
  })
);

app.use('/', router);

app.get('/', (req, res) => {
    res.send('Hello, ngrok!');
  });
  

const SERVER_HOST = process.env.SERVER_HOST;
app.listen(SERVER_HOST, '0.0.0.0', () => {
    console.log(`✅ Server Start Listening on port http://localhost:${SERVER_HOST}`);
});

export default app;