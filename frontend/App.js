import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Main from './src/screens/Main';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import CreateGroup from './src/screens/CreateGroup';
import UpdateGroup from './src/screens/UpdateGroup';
import Finances from './src/screens/Finances';
import Profile from './src/screens/Profile';
import PasswordChange from './src/screens/PasswordChange';
import {NavigationContainer} from '@react-navigation/native';
import CreateFinance from './src/screens/CreateFinance';
import UpdateFinance from './src/screens/UpdateFinance';
import { UserProvider } from './src/userContext';

const App = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const BottomTabScreen = () => {
    return (
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen name="Main" component={Main} />
        <Tab.Screen name="Login" component={Login} />
        <Tab.Screen name="SignUp" component={SignUp} />
        <Tab.Screen name="Finances" component={Finances} />
        <Tab.Screen name="Profile" component={Profile} />
        <Tab.Screen name="PasswordChange" component={PasswordChange} />
      </Tab.Navigator>
    );
  };
  return (
    <NavigationContainer>
      <UserProvider>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Bottom" component={BottomTabScreen} />
          <Stack.Screen name="CreateGroup" component={CreateGroup} />
          <Stack.Screen name="UpdateGroup" component={UpdateGroup} />
          <Stack.Screen name="CreateFinance" component={CreateFinance} />
          <Stack.Screen name="UpdateFinance" component={UpdateFinance} />
        </Stack.Navigator>
      </UserProvider>
    </NavigationContainer>
  );
};

export default App;
