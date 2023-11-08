// 일기 쓰기
export const createDiary = async (conn, params) => {
    const createDiarySql = `INSERT INTO Diary (rid, content, time, todaySummary) VALUES (?,?, DATE_ADD(now(), INTERVAL 9 HOUR), ?);`;

    const [newDiary] = await conn.query(createDiarySql, params);
    return [newDiary];
}

// 24시간 지난 일기 삭제하기
export const deleteDiary = async (conn) => {
    const deleteDiarySql = `DELETE FROM Diary WHERE time < DATE_SUB(now(), INTERVAL 1 DAY);`;
    await conn.query(deleteDiarySql);
}

// 일기 읽기
export const readDiary = async (conn, rid) => {
    const readDiary = 'SELECT * FROM Diary WHERE rid = ?';
    const [DiaryContent] = await conn.query(readDiary, rid);
    return [DiaryContent];
}

// 일기 내용 분석 결과 테이블 추가
export const insertSentiment = async (conn, params) => {
    const insertSentimentSql = `INSERT INTO Diary (todaySummary) VALUES (?);`;

    const [DiarySentiment] = await conn.query(insertSentimentSql, params);
    return [DiarySentiment];
}
