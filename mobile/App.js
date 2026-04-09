import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen    from './screens/HomeScreen';
import GuidanceScreen from './screens/GuidanceScreen';
import CameraScreen  from './screens/CameraScreen';
import PreviewScreen from './screens/PreviewScreen';
import ResultScreen  from './screens/ResultScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'none',      // instant cut — no slide animation
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        <Stack.Screen name="Home"     component={HomeScreen}     />
        <Stack.Screen name="Guidance" component={GuidanceScreen} />
        <Stack.Screen name="Camera"   component={CameraScreen}   />
        <Stack.Screen name="Preview"  component={PreviewScreen}  />
        <Stack.Screen name="Result"   component={ResultScreen}   />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
