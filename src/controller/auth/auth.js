import pool from "../../config/database.js";
import bcrypt from 'bcrypt';
import {sign, verify, refresh, refreshVerify} from '../../utils/jwtUtils.js';
import redisClient from "../../utils/redis.js";
import { isExistUser } from "../../dao/auth/userDao.js";
import { createUser } from "../../dao/auth/userDao.js";
import { readUser } from "../../dao/auth/userDao.js";

// 기존 사용자 로그인 함수
export const login = async (conn, id, password, res) => {

    // 사용자 정보 불러오기
    const [user] = await readUser(conn, id);
  //  console.log('user: ', user);

    // 비밀번호 일치 여부 확인
    const check = await bcrypt.compare(password, user[0].password);

    if (check) {
        // 비밀번호 일치, 로그인 성공
        // access & refresh token 발급
        const accessToken = sign(user[0]);
        const refreshToken = refresh(user);

        // 발급한 refresh token을 redis에 key를 id로 저장
        redisClient.set(user[0].rid, refreshToken);

        res.status(200).send({ // client에게 토큰 모두를 반환
            ok: true,
            data: {
                message: 'Login Successful',
                accessToken,
                refreshToken,
            },
          });
        } else {
            res.status(401).send({
            ok: false,
            message: 'password is incorrect',
        });
    }
};

// 신규 사용자 회원가입 및 로그인
export const joinAndLogin = async (conn, id, password, res) => {

    // bcrypt 암호화
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // 아이디, 암호화된 비밀번호 가지고 사용자 등록
    const params = [id, hashPassword];
    const [newUser] = await createUser(conn, params);

    if (newUser.length!=0) {
        // 사용자 추가 성공
        console.log('사용자 추가됨');
        // 등록 후 로그인까지
        login(conn, id, password, res);
    } else {
        // 사용자 추가 실패
        console.log('사용자 추가 실패');
        res.send({
            ok: false,
            message: 'Failed to add user'
        })
    }
}

export const auth = async (req, res) => {

    const { id, password } = req.body;

    try {
        const conn = await pool.getConnection();

        // 이미 있는 아이디인지 확인
        const [existUser] = await isExistUser(conn, id);

        if (existUser.length > 0) {
            // 아이디 있음, 바로 로그인
            console.log('아이디 있음');
            login(conn, id, password, res);          
        } else {
            // 아이디 없음, 회원가입 후 로그인
            console.log('아이디 없음');
            joinAndLogin(conn, id, password, res);
        }
        conn.release();
    } catch (error) {
        console.log("error: ", error);
        res.send({
            ok: false,
            message: error.message
        });
    }
}

export default auth;