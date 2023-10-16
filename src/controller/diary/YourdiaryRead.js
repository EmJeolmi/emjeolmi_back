import pool from "../../config/database.js";
import { readDiary } from "../../dao/diary/diaryDao.js";
import { readUser, readUserID } from "../../dao/auth/userDao.js";
import { updateVisitorInfo } from "../../dao/visitor/visitorDao.js"; // Visitor 정보 업데이트를 위한 DAO 추가

const YourdiaryRead = async (req, res) => {
    try {
        const conn = await pool.getConnection();

        const user_id = req.params.id; // 상대방 ID
        const [user] = await readUser(conn, user_id) // 상대방 데이터 조회
        const [diarycontent] = await readDiary(conn, user.map(item => item.rid)); // 상대방 rid 조회해서 일기 읽기
    
       
        const [visit] = await readUserID(conn, req.id) // 방문자 데이터 조회
        const [visit_id_array] = visit.map(item => item.id) // 방문자 ID (map 사용하면 배열로 추출)
        
        if (diarycontent.length !== 0) { // 상대방 일기 있을 때
            const visit_id = visit_id_array; // 방문자의 ID
            
            // Visitor 정보를 업데이트합니다.
            const updateSuccess = await updateVisitorInfo(conn, visit_id, user_id);

            if (updateSuccess) {
                res.status(200).send({
                    ok: true,
                    message: "Diary Reading complete",
                    data: diarycontent,
                    id:user_id,
                });
            } 
        } else { // 상대방 일기 없을 때
            res.status(200).send({
                ok:false,
            })
        }

        conn.release();
    } catch (error) {
        console.log("error: ", error);
        res.send({
            ok: false,
            message: error.message,
        });
    }
}

export default YourdiaryRead;