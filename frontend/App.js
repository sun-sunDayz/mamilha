import EStyleSheet from 'react-native-extended-stylesheet';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {View, Text, TextInput} from 'react-native';
<<<<<<< HEAD
import Intro from './src/screens/Intro';
=======
>>>>>>> ec327251560c0c68d99a6bfb3972d98b7b78b11a
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
import FinanceDetail from './src/screens/FinanceDetail';
import {UserProvider} from './src/userContext';

<<<<<<< HEAD
const App = () => {
  const Stack = createNativeStackNavigator();
=======
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const App = () => {
  const Stack = createNativeStackNavigator();

  const Tab = createBottomTabNavigator();
  const BottomTabScreen = () => {
    return (
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen name="Main" component={Main} />
        <Tab.Screen name="Login" component={Login} />
        <Tab.Screen name="SignUp" component={SignUp} />
        <Tab.Screen name="Profile" component={Profile} />
        <Tab.Screen name="PasswordChange" component={PasswordChange} />
      </Tab.Navigator>
    );
  };
>>>>>>> ec327251560c0c68d99a6bfb3972d98b7b78b11a
  return (
    <NavigationContainer>
      <UserProvider>
        <Stack.Navigator screenOptions={{headerShown: false}}>
<<<<<<< HEAD
          <Stack.Screen name="Intro" component={Intro} />
=======
          <Stack.Screen name="BottomTabScreen" component={BottomTabScreen} />
>>>>>>> ec327251560c0c68d99a6bfb3972d98b7b78b11a
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="CreateGroup" component={CreateGroup} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="PasswordChange" component={PasswordChange} />
          <Stack.Screen name="UpdateGroup" component={UpdateGroup} />
          <Stack.Screen name="Finances" component={Finances} />
          <Stack.Screen name="CreateFinance" component={CreateFinance} />
          <Stack.Screen name="UpdateFinance" component={UpdateFinance} />
          <Stack.Screen name="FinanceDetail" component={FinanceDetail} />
        </Stack.Navigator>
      </UserProvider>
    </NavigationContainer>
  );
};

export default App;
