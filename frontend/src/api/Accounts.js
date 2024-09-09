import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/apiClient';
import {setToken, removeToken} from '../api/TokenHandler'

export const login = async (username, password) => {
    try {
        const response = await apiClient.post('/api/login/', {
            username: username,
            password: password,
        });
        const {access, refresh} = response.data;
        await setToken(access, refresh);
        return true;
    } catch (error) {
        console.log('error', error);
        return false;
    }
};

export const logout = async () => {
    await removeToken();
};
