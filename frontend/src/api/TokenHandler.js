// TokenHandler.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { eventEmitter } from './LoginEventEmitter';

export const setToken = async (access, refresh) => {
    await AsyncStorage.setItem('accessToken', access);
    await AsyncStorage.setItem('refreshToken', refresh);
    eventEmitter.emit('accessTokenChanged'); // 토큰 변경 이벤트 발생
};

export const removeToken = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    eventEmitter.emit('accessTokenChanged'); // 토큰 삭제 이벤트 발생
};
