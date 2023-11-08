import { promisify } from 'util';   // 비동기로 돌리려는 함수를 promise로 감싸주지 않고 사용 가능
import redisClient from './redis.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.SECRET_KEY;

// access token 발급
export const sign = (user) => {
    const payload = { // access token에 들어갈 payload
        rid:user.rid,
    };
    return jwt.sign(payload, secretKey, { // secret으로 sign하여 발급하고 return
        algorithm: 'HS256', // 암호화 알고리즘
        expiresIn: '20h',    // 유효기간
    });
};

// access token 검증
export const verify = (token) => {
    let decoded = null;
    try {
      decoded = jwt.verify(token, secretKey);
      return {
        ok: true,
        rid: decoded.rid,
      };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
};

// refresh token 발급
export const refresh = () => {
    return jwt.sign({}, secretKey, { // refresh token은 payload 없이 발급
        algorithm: 'HS256',
        expiresIn: '20d',
    });
};

// refresh token 검증
// redis 모듈은 기본적으로 promise를 반환하지 않음
// promisify를 이용해 promise를 반환하게 해줌
export const refreshVerify = async (token, id) => {
    const getAsync = promisify(redisClient.get).bind(redisClient);
    
    try {
        const data = await getAsync(id); // refresh token 가져오기
        if (token === data) {
            try {
                jwt.verify(token, secretKey);
                return true;
            } catch (err) {
                return false;
            }
        } else {
            return false;
        }
    } catch (err) {
      return false;
    }
};