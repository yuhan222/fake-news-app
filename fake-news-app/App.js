// App.js
import React from 'react';
import { StyleSheet, View, Dimensions, Platform, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // 🔑 核心修正：修復網頁與手勢 Crash

import { QuizProvider } from './QuizContext';
import HistoryScreen from './screens/HistoryScreen';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import ResultScreen from './screens/ResultScreen';
import LearningScreen from './screens/LearningScreen';

const Stack = createStackNavigator();
const { width: WINDOW_WIDTH } = Dimensions.get('window');

export default function App() {
  // 💻 判斷當前環境：如果是電腦網頁瀏覽器 (Web) 且寬度大於 500px，則自動啟動「虛擬手機模式」
  const isWebDesktop = Platform.OS === 'web' && WINDOW_WIDTH > 500;

  // 📦 將原本完整的導航與資料中樞邏輯抽離成獨立的內部元件，確保手機與網頁端讀取同一套系統
  const MainAppContent = () => (
    <QuizProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Learning" component={LearningScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </QuizProvider>
  );

  if (isWebDesktop) {
    // 💻 【電腦網頁渲染】：包覆精美科技感的手機外殼，讓教授在電腦評分時一目了然
    return (
      <GestureHandlerRootView style={styles.webDesktopBackground}>
        <StatusBar barStyle="light-content" />
        
        {/* 虛擬手機外殼邊框 */}
        <View style={styles.phoneShell}>
          {/* 擬真手機頂部黑色瀏海 (Notch) */}
          <View style={styles.phoneNotch}>
            <View style={styles.cameraLens} />
            <View style={styles.speakerEar} />
          </View>

          {/* 手機內框可視視窗區域（頂部留出 24px 避開瀏海） */}
          <View style={styles.phoneInnerContainer}>
            <MainAppContent />
          </View>
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={Platform.OS === 'web' ? { flex: 1, touchAction: 'pan-y' } : { flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <MainAppContent />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  webDesktopBackground: {
    flex: 1,
    backgroundColor: '#0B132B',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
  },
  // 虛擬手機實體外殼參數 (比照 iPhone 標準黃金比例)
  phoneShell: {
    width: 375,
    height: 812,
    backgroundColor: '#1E293B', // 太空灰框
    borderRadius: 44,
    borderWidth: 12,
    borderColor: '#334155', // 按鍵外圈質感
    overflow: 'hidden',
    position: 'relative',
    // 網頁版專屬呼吸外陰影，大螢幕投影效果極佳
    shadowColor: '#48CAE4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
  },
  // 虛擬手機瀏海元件
  phoneNotch: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -70, // 置中
    width: 140,
    height: 24,
    backgroundColor: '#000000',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    zIndex: 9999,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  cameraLens: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E293B',
  },
  speakerEar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#334155',
  },
  // 手機內框區域
  phoneInnerContainer: {
    flex: 1,
    backgroundColor: '#0B132B',
    paddingTop: 24, // 預留寬度防止內頁標題被上方虛擬瀏海遮擋
  },
});