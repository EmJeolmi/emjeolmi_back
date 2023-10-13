import pool from "../../config/database.js";
import { createDiary } from "../../dao/diary/diaryDao.js";

const diaryUpload = async (req, res) => {

    const { content } = req.body;
    const rid = req.id;
    console.log("req.id: ", req.id);

    try {
        const conn = await pool.getConnection();
        const params = [rid, content];
        
        // 일기 등록 sql
        const [newDiary] = await createDiary(conn, params);
        res.status(200).send({
            ok: true,
            message: 'Diary registration complete',
        })
        conn.release();
    } catch (error) {
        console.log("error: ", error);
        res.send({
            ok: false,
            message: error.message
        });
    }
}

export default diaryUpload;