import EStyleSheet from 'react-native-extended-stylesheet';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {View, Text, TextInput} from 'react-native';
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

const App = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <UserProvider>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="CreateGroup" component={CreateGroup} />
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
