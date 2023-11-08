import axios from "axios";
import pool from "../../config/database.js";
import { createDiary } from "../../dao/diary/diaryDao.js";

export const diaryUpload = async (req, res) => {

    const { content } = req.body;
    const rid = req.id;
    console.log("req.id: ", req.id);

    try {
        const conn = await pool.getConnection();

        const clientID = "xadynm9byi";
        const clientSecret = "8jcso6wyGUWukRl7KHqo5wqhSiWZUpyCRp44iNHo";
        const apiUrl = "https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze"; // Clova Sentiment API 엔드포인트 URL

        // 요청 헤더 설정
        const headers = {
            'X-NCP-APIGW-API-KEY-ID': clientID,
            'X-NCP-APIGW-API-KEY': clientSecret,
            'Content-Type': 'application/json',
        };

        // 요청 바디 데이터
        const data = {
            content,
        };

        // Clova Sentiment API 호출
        const response = await axios.post(apiUrl, data, { headers });
        const responseData = response.data;

        // 전체 문장 관련 정보
        // 전체 문장 감정, 전체 감정 confidence, 중립, 긍정, 부정
        const document = responseData.document;  

        // 분류 문장 관련 정보
        // 분류 문장, 감정, 감정 confidence, 중립, 긍정, 부정
        const sentences = responseData.sentences;

        const negative = document.confidence.negative;
        const positive = document.confidence.positive;
        const neutral = document.confidence.neutral;

        console.log('document: ', document);
        console.log('sentences: ', sentences);
        
        // 감정 분류
        var maxSentiment = negative;
        if (maxSentiment < positive) {
            maxSentiment = positive;
        }
        if (maxSentiment < neutral) {
            maxSentiment = neutral;
        }

        var todaySummaryTxt = '';
        // if (maxSentiment == negative) {
        //     todaySummaryTxt = '오늘은 힘들었던 하루 ..';
        // } else if (maxSentiment == positive) {
        //     todaySummaryTxt = '웃음 가득 하루 !!';
        // } else {
        //     todaySummaryTxt = '무탈이 최고 !!';
        // }

        if (neutral > 50) {
            todaySummaryTxt = '보통의 하루 ㅎㅎ';
        } else if (positive>50 && positive<70) {
            todaySummaryTxt = '평화로운 하루 ~';
        } else if (positive>70 && positive<80) {
            todaySummaryTxt = '기분 좋은 하루 !!';
        } else if(positive>80) {
            todaySummaryTxt = '최고의 하루 !!!'
        } else if (negative>50 && negative<70) {
            todaySummaryTxt = '꿀꿀한 하루 .. ';
        } else if (negative>70 && negative<80) {
            todaySummaryTxt = '우중충한 하루 ..';
        } else if(negative>80) {
            todaySummaryTxt = '우울한 하루 ..'
        } else {
            todaySummaryTxt = '무탈할 하루 ~';
        }

        const params = [rid, content, todaySummaryTxt];
        
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