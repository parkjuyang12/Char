import json
import requests

# API 엔드포인트 URL
api_url = "http://localhost:8080/api/place/add"

# 첨부할 이미지 파일 경로
image_path = "next.svg"  # 실제 이미지 파일 경로로 변경하세요

# JSON 파일 읽기
try:
    with open("./전국관광지정보표준데이터.json", 'r', encoding='utf-8') as f:
        data = json.load(f)
except FileNotFoundError:
    print("Error: 지정된 파일을 찾을 수 없습니다.")
    exit()
except json.JSONDecodeError:
    print("Error: JSON 파일 형식이 올바르지 않습니다.")
    exit()

# POST할 데이터 (form-data 형태로 구성)
files = {'placeImageURL': open(image_path, 'rb')}  # 키 이름을 'placeImageURL'로 변경
headers = {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImhpQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX0FETUlOIiwiaWF0IjoxNzQ3MTA3MTkyLCJleHAiOjE3NDcxMTA3OTJ9.MToP29H-WOfbT3yqJtdJxZokypNaRqgHMJuOt6yfRj0'}
if "records" in data and isinstance(data["records"], list):
    for record in data["records"]:
        payload = {
            "placeTitle": record.get("관광지명"),
            "lat": str(record.get("위도")),
            "lng": str(record.get("경도")),
            "rating": 3,
            "placeDescription":str(record.get("관광지소개")),
            # "placeURL": record.get("상세URL") if "상세URL" in record else "http://example.com/default", # 이 줄을 제거
        }
        try:
            response = requests.post(api_url, headers=headers, files=files, data=payload)
            response.raise_for_status()
            print(f"POST 요청 성공! (장소: {payload.get('placeTitle')}), 응답 상태 코드: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"POST 요청 실패 (장소: {payload.get('placeTitle')}): {e}")
            if response is not None:
                print(f"응답 상태 코드: {response.status_code}, 응답 내용: {response.text}")
        except Exception as e:
            print(f"알 수 없는 오류 발생 (장소: {payload.get('placeTitle')}): {e}")
        finally:
            files['placeImageURL'].seek(0)
else:
    print("Error: JSON 파일에 'records' 키가 없거나 리스트 형태가 아닙니다.")

if 'placeImageURL' in files:
    files['placeImageURL'].close()