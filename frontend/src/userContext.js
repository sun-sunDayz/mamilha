import React, {createContext, useState, useEffect} from 'react'
import {jwtDecode} from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {eventEmitter} from './api/LoginEventEmitter'


export const UserContext = createContext();
export const UpdateUserContext = createContext();

export const UserProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        updateCurrentUser();

        // 'accessTokenChanged' 이벤트를 구독하여 호출 시 updateCurrentUser 실행
        const handleTokenChange = () => {
            updateCurrentUser();
        };
        
        eventEmitter.on('accessTokenChanged', handleTokenChange);
        
        // 컴포넌트 언마운트 시 이벤트 리스너 해제
        return () => {
            eventEmitter.off('accessTokenChanged', handleTokenChange);
        };
    }, [])

    const updateCurrentUser = async () => {
        const accessToken = await AsyncStorage.getItem('accessToken')

        if (accessToken) {
            try {
                const decodedUser = jwtDecode(accessToken)
                setCurrentUser(decodedUser)
            } catch (error) {
                console.error('Invalid token:', error)
                setCurrentUser({
                    username: '',
                    nickname: '',
                })
            }
        } else {
            setCurrentUser(null)
        }
    }

    return (
        <UserContext.Provider value={currentUser}>
            <UpdateUserContext.Provider value={updateCurrentUser}>
                {children}
            </UpdateUserContext.Provider>
        </UserContext.Provider>
    );
}
