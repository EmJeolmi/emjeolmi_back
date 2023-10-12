import { readDiary } from "../../dao/diary/diaryDao.js";
import { readUser } from "../../dao/auth/userDao.js";
import { updateVisitorInfo } from "../../dao/visitor/visitorDao.js"; // Visitor 정보 업데이트를 위한 DAO 추가

const YourdiaryRead = async (req, res) => {
    try {
        const id = req.body.id;
        const conn = await pool.getConnection();
        const [user] = await readUser(conn, id);
        const [diarycontent] = await readDiary(conn, user[0].rid);

        if (diarycontent.length !== 0) {
            console.log(diarycontent);
            console.log(user[0].id);
            const visitorId = user[0].id; // 방문자(당신)의 ID
            const visitorRid = user[0].rid; // 사용자의 RID

            // Visitor 정보를 업데이트합니다.
            const updateSuccess = await updateVisitorInfo(conn, visitorId, visitorRid);

            if (updateSuccess) {
                res.status(200).send({
                    ok: true,
                    message: Diary Reading complete, 호출된 id는 ${id}입니다.,
                });
            } else {
                res.status(500).send({
                    ok: false,
                    message: "Visitor 정보 업데이트에 실패했습니다.",
                });
            }
        } else {
            res.send("일기가 존재하지 않습니다.");
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