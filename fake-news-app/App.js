import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { QuizProvider } from './QuizContext';

import HistoryScreen from './screens/HistoryScreen';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import ResultScreen from './screens/ResultScreen';
// 1. 引入新的學習頁面
import LearningScreen from './screens/LearningScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <QuizProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          {/* 2. 將 LearningScreen 加入導航堆疊中 */}
          <Stack.Screen name="Learning" component={LearningScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </QuizProvider>
  );
}