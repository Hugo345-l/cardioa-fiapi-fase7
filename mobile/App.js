import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'

import LoginScreen from './src/screens/LoginScreen'
import DashboardScreen from './src/screens/DashboardScreen'
import AnalyzeScreen from './src/screens/AnalyzeScreen'
import ChatScreen from './src/screens/ChatScreen'

const Stack = createNativeStackNavigator()

const screenOptions = {
  headerStyle: { backgroundColor: '#1e293b' },
  headerTintColor: '#f1f5f9',
  headerTitleStyle: { fontWeight: '700' },
  contentStyle: { backgroundColor: '#0f172a' },
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: '❤️ CardioIA', headerBackVisible: false }} />
        <Stack.Screen name="Analyze" component={AnalyzeScreen} options={{ title: 'Análise de Risco' }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Assistente' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
