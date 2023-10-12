import pool from '../../config/database.js';
import { readUser } from "../../dao/auth/userDao.js";

// 방문자 정보를 업데이트하는 함수
const updateVisitorInfo = async (visitorId, userId) => {
    try {
        const conn = await pool.getConnection();



        // 방문자(당신)의 ID와 사용자(일기장 주인)의 ID를 이용하여 RID를 가져옵니다.
        const [user] = await readUser(conn, userId);
        if (user.length === 0) {
            conn.release();
            return false;
        }
        const userRid = user[0].rid;

        // 이제 방문자(당신)의 ID를 방문자 테이블의 visit_id 열에,
        // 사용자(일기장 주인)의 RID를 방문자 테이블의 rid 열에 저장합니다.
        const updateQuery = "UPDATE Visitor SET visit_id = ?, rid = ?";
        const values = [userId, userRid];
        

        conn.query(updateQuery, values, (err, result) => {
            conn.release();
            if (err) {
                console.error('MySQL 오류:', err);
                return false;
            }
        });
        return true;
    } catch (error) {
        console.error('Error updating visitor info:', error);
        return false;
    }
};

export { updateVisitorInfo };
