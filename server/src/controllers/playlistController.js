import axios from 'axios';
import { getPlaylistById, updatePlaylistTitle, deletePlaylistById } from '../services/playlistService.js';
import logger from '../utils/logger.js';
import prisma from '../models/index.js';


export const createLyricsPlaylist = async (req, res, next) => {
  try {
    const playlistData = req.body;
    const modelResponse = await axios.post('http://localhost:5000/myplaylist', playlistData);
    
    res.json(modelResponse.data);
  } catch (error) {
    logger.error('가사 기반 플레이리스트 생성 중 오류:', error);
    next(error);
  }
};

export const createEmotionPlaylist = async (req, res, next) => {
  try {
    const playlistData = req.body;
    console.log('모델 서버로 보내는 데이터:', playlistData);
    
    const modelResponse = await axios.post('http://localhost:5000/myplaylist', playlistData);
    
    console.log('모델 서버 응답:', modelResponse.data);
    res.json(modelResponse.data);
  } catch (error) {
    logger.error('감정 기반 플레이리스트 생성 중 오류:', error.response?.data || error.message);
    if (error.response && error.response.status === 422) {
      res.status(422).json({ 
        message: '입력 데이터 오류', 
        details: error.response.data.detail 
      });
    } else {
      next(error);
    }
  }
};

export const savePlaylist = async (req, res, next) => {
  try {
    const { title, tracks, userId } = req.body;
    
    const savedPlaylist = await prisma.playlist.create({
      data: {
        title,
        userId,
        tracks: {
          create: tracks.map(track => ({
            title: track.title,
            artist: track.artist,
            albumArt: track.albumArt,
            genre: track.genre,
            spotify_id: track.spotify_id
          }))
        }
      },
      include: {
        tracks: true
      }
    });

    res.json(savedPlaylist);
  } catch (error) {
    logger.error('플레이리스트 저장 중 오류:', error);
    next(error);
  }
};

export const getPlaylistByIdHandler = async (req, res, next) => {
  const { playlistId } = req.params;
  try {
    const playlist = await getPlaylistById(parseInt(playlistId, 10));
    res.json({ playlist });
  } catch (error) {
    logger.error(`플레이리스트 조회 중 오류: ${error.message}`);
    next(error);
  }
};

export const updatePlaylistTitleHandler = async (req, res, next) => {
  const { playlistId } = req.params;
  const { newTitle } = req.body;
  try {
    const updatedPlaylist = await updatePlaylistTitle(playlistId, newTitle);
    res.json({ success: true, playlist: updatedPlaylist });
  } catch (error) {
    logger.error(`플레이리스트 제목 수정 중 오류: ${error.message}`);
    next(error);
  }
};

export const deletePlaylistHandler = async (req, res, next) => {
  const { playlistId } = req.params;
  try {
    await deletePlaylistById(playlistId);
    res.json({ success: true, message: '플레이리스트가 삭제되었습니다.' });
  } catch (error) {
    logger.error(`플레이리스트 삭제 중 오류: ${error.message}`);
    next(error);
  }
};

