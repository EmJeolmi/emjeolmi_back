import pool from '../../config/database.js';
import { readUser } from "../../dao/auth/userDao.js";

// 방문자 정보를 업데이트하는 함수
const updateVisitorInfo = async (conn, VisitId, UserId) => {
    try {  
      const selectQuery = `SELECT visit_id FROM Visitor WHERE visit_id = ? AND user_id = ?`;
      const insertQuery = `INSERT INTO Visitor (visit_id, user_id) VALUES (?, ?)`;
      const ID = [VisitId, UserId];

      const [rows] = await conn.query(selectQuery, ID); // 넣고자 하는 값과 동일한 레코드 있는지 query문 실행
      
      if (rows.length === 0) {
        await conn.query(insertQuery, ID);
        console.log("방문자 추가 완료");
    } else {
        console.log("이미 방문한 적 있네요..");
    }
    
    conn.release();
    return true;
    } catch (error) {
        console.error('Error updating visitor info:', error);
        return false;
    }
};

export { updateVisitorInfo };