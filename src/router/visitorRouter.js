
import pool from "../config/database.js";
import express from "express";
import getVisitorsByUserRid from "../controller/visitor/visitorRead.js"; // getVisitorsByUserRid 함수를 import하세요
import { readUser } from "../dao/auth/userDao.js";

const router = express.Router();

// 방문자 목록을 반환하는 API 엔드포인트
router.get('/readVisitorsByUserRid', async (req, res) => { 
  try { 
    const id = req.body.id;
    const conn = await pool.getConnection();
    const [user] = await readUser(conn, id);

    const userRid = user[0].rid; // 사용자의 RID를 쿼리 파라미터로 받아옵니다.
    const visitorIds = await getVisitorsByUserRid(userRid); // 방문자 ID 배열을 가져옵니다.
    res.json({ visitorIds });
  } catch (error) {
    console.error('Error getting visitor IDs:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

export default router;
