import pool from "../../config/database.js";

// 일기장에 접속한 사용자의 RID에 대응하는 방문자 ID 배열을 가져오는 함수
const getVisitorsByUserRid = async (userRid) => {
    try {
        const conn = await pool.getConnection();
        const query = 'SELECT visit_id FROM Visitor WHERE rid = ?';

        const [visitors] = await conn.query(query, userRid);
        conn.release();
        

        if (visitors.length > 0) {
            //const visitorIds = visitors.map((visitor) => visitor.visit_id);
            return visitors; 
        } else {
            return []; // 방문자가 없을 경우 빈 배열 반환
        }
    } catch (error) {
        console.error('Error fetching visitor IDs:', error);
        return [];
    }
};

export default getVisitorsByUserRid;
