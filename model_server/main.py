from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
import uvicorn
import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import time

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8888"],  # API 서버의 URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JSON 파일 로드
def load_merged_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# 전역 변수로 데이터 로드
merged_data = load_merged_data('updated_merged_file_with_spotify_data.json')

# TF-IDF 벡터라이저 초기화
tfidf_vectorizer = TfidfVectorizer()

# 가사 데이터 벡터화
lyrics_data = [song['lyrics'] for song in merged_data if 'lyrics' in song]
lyrics_vectors = tfidf_vectorizer.fit_transform(lyrics_data)

# 벡터 생성
def create_vectors(input_genres, input_song_types):
    all_genres = set()
    all_song_types = set()

    # 모든 장르와 노래 타입 수집
    for song in merged_data:
        all_genres.update(song['genres'])
        all_song_types.update(song['song_type'])

    all_genres = list(all_genres)
    all_song_types = list(all_song_types)

    input_vector = np.zeros(len(all_genres) + len(all_song_types))

    # 사용자 입력 벡터화
    for genre in input_genres:
        if genre in all_genres:
            input_vector[all_genres.index(genre)] = 1

    for song_type in input_song_types:
        if song_type in all_song_types:
            input_vector[len(all_genres) + all_song_types.index(song_type)] = 1

    song_vectors = []

    # 각 노래 벡터화
    for song in merged_data:
        song_vector = np.zeros(len(all_genres) + len(all_song_types))
        for genre in song['genres']:
            if genre in all_genres:
                song_vector[all_genres.index(genre)] = 1
        for song_type in song['song_type']:
            if song_type in all_song_types:
                song_vector[len(all_genres) + all_song_types.index(song_type)] = 1

        song_vectors.append(song_vector)

    return np.array(song_vectors), input_vector

# 가장 유사한 노래 추천
def recommend_songs(song_vectors, input_vector, prefer_latest, input_genres, search_term=None):
    if search_term:
        # 검색어와 가사 유사도 계산
        search_vector = tfidf_vectorizer.transform([search_term])
        lyrics_similarities = cosine_similarity(lyrics_vectors, search_vector).flatten()
        recommendations = [(song, sim) for song, sim in zip(merged_data, lyrics_similarities) if sim > 0]
    else:
        # 기존 장르 및 곡 타입 기반 추천
        similarities = cosine_similarity(song_vectors, input_vector.reshape(1, -1)).flatten()
        recommendations = [(song, sim) for song, sim in zip(merged_data, similarities) if sim > 0]

    # 최신곡 선호 여부에 따른 정렬
    if prefer_latest:
        recommendations.sort(key=lambda x: (-x[1], -x[0]['first_date'], x[0]['high_rank'], -x[0]['rank_count']))
    else:
        recommendations.sort(key=lambda x: (-x[1], x[0]['high_rank'], -x[0]['first_date'], -x[0]['rank_count']))

    if recommendations:
        return recommendations[:5]  # 상위 5곡만 추천

    # 추천할 노래가 없을 경우
    return fallback_recommendation(input_genres)

# 장르에 기반한 fallback 추천
def fallback_recommendation(input_genres):
    # 입력 장르에 해당하는 노래 필터링
    fallback_candidates = [song for song in merged_data if any(genre in song['genres'] for genre in input_genres)]

    if not fallback_candidates:
        return []  # 장르에 해당하는 곡이 없다면 빈 리스트 반환

    # 조건에 맞는 노래 정렬
    fallback_candidates.sort(key=lambda x: (x['high_rank'], -x['first_date'], -x['rank_count']))

    return [(fallback_candidates[0], 0)]  # 가장 높은 rank가 낮은 곡을 추천

# 데이터 모델 정의
class RecommendationRequest(BaseModel):
    searchTerm: Optional[str] = None
    genres: Optional[str] = None
    song_types: Optional[List[str]] = None
    prefer_latest: bool
    userId: int
    title: str

    @validator('genres')
    def validate_genres(cls, v):
        if v is None:
            raise ValueError('genres는 필수 항목입니다.')
        return v

    @validator('song_types')
    def validate_song_types(cls, v):
        if v is None or len(v) == 0:
            raise ValueError('song_types는 최소 하나 이상의 항목이 필요합니다.')
        return v

# 모델 서버의 엔드포인트 - 클라이언트에서 입력값을 받아 추천 결과 반환
@app.post("/myplaylist")
async def recommend_and_create_playlist(request: RecommendationRequest):
    start_time = time.time()

    try:
        # 입력 검증
        if request.searchTerm and (request.genres or request.song_types):
            raise HTTPException(status_code=400, detail="검색어와 장르/곡 타입은 동시에 사용할 수 없습니다.")
        
        # 추천 로직 수행
        if request.searchTerm:
            recommendations = recommend_songs(None, None, request.prefer_latest, None, search_term=request.searchTerm)
        else:
            if not request.genres or not request.song_types:
                raise HTTPException(status_code=400, detail="장르와 곡 타입을 모두 입력해주세요.")
            song_vectors, input_vector = create_vectors([request.genres], request.song_types)
            recommendations = recommend_songs(song_vectors, input_vector, request.prefer_latest, [request.genres])

        if not recommendations:
            raise HTTPException(status_code=404, detail="추천할 노래가 없습니다.")

        # 추천된 플레이리스트를 JSON 형태로 응답
        response = {
            "title": request.title,
            "userId": request.userId,
            "tracks": [
                {
                    "title": song['title'],
                    "artist": song['artist'],
                    "albumArt": song['album_art'],
                    "genre": song['genres'][0] if song['genres'] else "Unknown",
                    "spotify_id": song['spotify_id']
                }
                for song, _ in recommendations
            ]
        }

        end_time = time.time()
        elapsed_time = end_time - start_time
        print(f"총 처리 시간: {elapsed_time:.2f}초")
        
        # JSON 응답 반환
        return response
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)