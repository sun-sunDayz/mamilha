import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Home from "./src/screens/Home"
import Activity from "./src/screens/Activity"
import Profile from "./src/screens/Profile"
import { NavigationContainer } from "@react-navigation/native";

const App = () => {
  const Stack = createNativeStackNavigator()
  const Tab = createBottomTabNavigator()
  const BottomTabScreen = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home}/>
        <Tab.Screen name="Activity" component={Activity}/>
        <Tab.Screen name="Profile" component={Profile}/>
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