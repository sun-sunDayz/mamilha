import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Main from "./src/screens/Main"
import Login from "./src/screens/Login"
import { NavigationContainer } from "@react-navigation/native";

const App = () => {
  const Stack = createNativeStackNavigator()
  const Tab = createBottomTabNavigator()
  const BottomTabScreen = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Main" component={Main}/>
        <Tab.Screen name="Login" component={Login}/>
      </Tab.Navigator>


    )

  }
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Bottom" component={BottomTabScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
}

export default App;