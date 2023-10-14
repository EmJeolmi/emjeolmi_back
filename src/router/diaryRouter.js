import express from "express";
import diaryUpload from "../controller/diary/diaryUpload.js";
import diaryDelete from "../controller/diary/diaryDelete.js";
import MydiaryRead from "../controller/diary/MydiaryRead.js";
import YourdiaryRead from "../controller/diary/YourdiaryRead.js";
import authJWT from '../middleware/auth/authMiddleware.js';

const router = express.Router();

// 일기 쓰기
// POST /api/diary/diaryUpload
router.post('/diaryUpload', authJWT, diaryUpload);

// 내 일기 읽어오기
// POST /api/diary/MydiaryRead
router.get('/MydiaryRead', authJWT, MydiaryRead);

// 상대방 일기 읽어오기
// POST /api/diary/자신의 ID
router.get('/:id', authJWT, YourdiaryRead);

// 24시간 지난 일기 삭제
// DELETE /api/diary/diaryDelete
router.post('/diaryDelete', diaryDelete);

export default router;
