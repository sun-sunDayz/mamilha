import EStyleSheet from 'react-native-extended-stylesheet';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {View, Text, TextInput} from 'react-native';
import Main from './src/screens/Main';
import Intro from './src/screens/Intro';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import CreateGroup from './src/screens/CreateGroup';
import UpdateGroup from './src/screens/UpdateGroup';
import InviteGroup from './src/screens/InviteGroup';
import InviteGroupDetail from './src/screens/InviteGroupDetail';
import InviteGroupDetailNew from './src/screens/InviteGroupDetailNew';
import Finances from './src/screens/Finances';
import Profile from './src/screens/Profile';
import PasswordChange from './src/screens/PasswordChange';
import {NavigationContainer} from '@react-navigation/native';
import CreateFinance from './src/screens/CreateFinance';
import UpdateFinance from './src/screens/UpdateFinance';
import FinanceDetail from './src/screens/FinanceDetail';
import CreateGroupMember from './src/screens/CreateGroupMember';
import {UserProvider} from './src/userContext';
import {MemberProvider} from './src/memberContext';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const App = () => {
  const Stack = createNativeStackNavigator();

  const Tab = createBottomTabNavigator();
  const BottomTabScreen = () => {
    return (
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen name="Intro" component={Intro} />
        <Tab.Screen name="Main" component={Main} />
        <Tab.Screen name="Login" component={Login} />
        <Tab.Screen name="SignUp" component={SignUp} />
        <Tab.Screen name="Profile" component={Profile} />
        <Tab.Screen name="PasswordChange" component={PasswordChange} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <UserProvider>
        <MemberProvider>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="BottomTabScreen" component={BottomTabScreen} />
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="CreateGroup" component={CreateGroup} />
          <Stack.Screen name="InviteGroup" component={InviteGroup} />
          <Stack.Screen name="InviteGroupDetail" component={InviteGroupDetail} />
          <Stack.Screen name="InviteGroupDetailNew" component={InviteGroupDetailNew} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="PasswordChange" component={PasswordChange} />
          <Stack.Screen name="Finances" component={Finances} />
          <Stack.Screen name="CreateFinance" component={CreateFinance} />
          <Stack.Screen name="UpdateFinance" component={UpdateFinance} />
          <Stack.Screen name="FinanceDetail" component={FinanceDetail} />
          <Stack.Screen name="UpdateGroup" component={UpdateGroup} />
          <Stack.Screen name="CreateGroupMember" component={CreateGroupMember} />
        </Stack.Navigator>
        </MemberProvider>
      </UserProvider>
    </NavigationContainer>
  );
};

export default App;
