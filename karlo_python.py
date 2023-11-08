import requests
import json
import urllib
from PIL import Image
from decouple import config # python-decouple 라이브러리 : 환경변수 로드
from flask import Flask, request, jsonify # flask 웹 서버 
import os
import mysql.connector
from io import BytesIO

app = Flask(__name__)

@app.route('/receive-text', methods=['POST']) # 파이썬 서버 엔드포인트 

def receive_text(): 
    if request.method == 'POST':
        data = request.get_json()
        prompt = data.get('text') # POST 요청 body에 있는 translatedContent 추출

        # 이미지 생성 요청
        response = t2i(prompt)

       
        if response and "images" in response:
            
            first_image = response["images"][0]
            image_url = first_image.get("image") # get을 사용하면, image 필드가 없어도 코드 오류 없이 계속 실행
            
            if image_url:
               result = Image.open(urllib.request.urlopen(image_url)) # 이미지 객체 저장
       
               # public 디렉토리에 이미지 저장
               path = os.path.join("C:/Users/김가희/Documents/GitHub/emjeolmi_front/src/images", "output.png")
               result.save(path)  #
               print("이미지 생성 및 저장 완료.")
               return jsonify({"message:": "Image generated and saved successfully"})
            else:
               print("이미지 URL을 찾을 수 없습니다.")


# 이미지 생성하기 요청
def t2i(prompt): # def라는 함수 정의
 
    REST_API_KEY = config('REST_API_KEY')
    
    data = {
        'prompt': prompt,
    }

    headers = { # POST 요청 본문은 json 형식
            'Authorization': f'KakaoAK {REST_API_KEY}',
            'Content-Type': 'application/json'
        }

    res = requests.post(
        'https://api.kakaobrain.com/v2/inference/karlo/t2i',
        json = data,
        headers = headers
    )
    return res.json()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000) # 'http://0.0.0.0:8000/receive-text