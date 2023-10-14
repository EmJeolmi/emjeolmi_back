// 사용자 생성
export const createUser = async (conn, params) => {
    const createUserSql = `INSERT INTO User (id, password) VALUES (?,?);`;

    const [newUser] = await conn.query(createUserSql, params);
    return [newUser];
}

// 사용자 아이디 중복 확인 
export const isExistUser = async (conn, id) => {
    // id에 맞는 row를 가져옴
    const isExistUserSql = `SELECT id FROM User WHERE id=?;`;

    const existUser = await conn.query(isExistUserSql, [id]);
    return existUser;
};

// 사용자 정보 불러오기
export const readUser = async (conn, id) => {
    const readUserSql = `SELECT * FROM User WHERE id=?;`;

    const user = await conn.query(readUserSql, [id]);
    return user;
};

// rid -> id
export const readUserID = async (conn, rid) => {
    const readUserIDSql = `SELECT id FROM User WHERE rid=?;`;

    const id = await conn.query(readUserIDSql, [rid]);
    return id;
};