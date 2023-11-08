import express from "express";
import authRouter from "./authRouter.js";
import diaryRouter from "./diaryRouter.js";
import visitorRouter from './visitorRouter.js';

const router = express.Router();

// auth
router.use('/api/user', authRouter);

// diary
router.use('/api/diary', diaryRouter);

// visitor
router.use('/api/visitor', visitorRouter);

export default router;