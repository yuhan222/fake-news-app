// QuizContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 🔑 核心修正：讓大腦直接連動獨立的 questions_db.json 外部資料庫
import rawQuestions from './questions_db.json'; 

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [xp, setXp] = useState(0); 
  const [level, setLevel] = useState('識讀實習生'); // 🔑 稱號名詞全面媒體識讀專業化
  const [isLoading, setIsLoading] = useState(true);

  const [history, setHistory] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    wrongTypes: [], // 儲存答錯的假訊息特徵分類（如：'製造恐慌'）
    records: [],
  });

  // App 啟動時自動從手機/網頁本地硬碟載入 AsyncStorage 數據
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('@fake_news_app_storage');
        if (savedData !== null) {
          const parsed = JSON.parse(savedData);
          setXp(parsed.xp || 0);
          setLevel(parsed.level || '識讀實習生');
          if (parsed.history) setHistory(parsed.history);
        }
      } catch (error) {
        console.error('[QuizContext] AsyncStorage 載入失敗:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStoredData();
  }, []);

  // 內部同步寫入方法
  const syncToStorage = async (updatedXp, updatedLevel, updatedHistory) => {
    try {
      const dataToSave = { xp: updatedXp, level: updatedLevel, history: updatedHistory };
      await AsyncStorage.setItem('@fake_news_app_storage', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('[QuizContext] AsyncStorage 寫入失敗:', error);
    }
  };

  // 🔑 媒體識讀專業級進階升段公式
  const calculateLevel = (currentXp) => {
    if (currentXp >= 100 && currentXp < 250) return '資訊調查員';
    if (currentXp >= 250) return '事實查核專家';
    return '識讀實習生';
  };

  // 觀看提示扣除點數
  const useHintDeduct = (deductAmount = 15) => {
    setXp((prevXp) => {
      const newXp = Math.max(0, prevXp - deductAmount);
      const newLevel = calculateLevel(newXp);
      syncToStorage(newXp, newLevel, history);
      return newXp;
    });
  };

  // 挑戰模式一整輪測驗結束後的大面板結算持久化
  const saveChallengeSession = (sessionScore, sessionTotal, sessionDetails) => {
    const accuracy = Math.round((sessionScore / sessionTotal) * 100);
    const xpGained = sessionScore * 20; // 答對一題獲取 20 XP 大獎勵
    const newXp = xp + xpGained;
    const newLevel = calculateLevel(newXp);
    
    setXp(newXp);
    setLevel(newLevel);

    setHistory((prevHistory) => {
      const currentWrongTypes = [...prevHistory.wrongTypes];
      sessionDetails.forEach(det => {
        // 如果答錯了，將第一個核心標籤（假訊息操控手段）抓出來做為弱點數據
        if (!det.isCorrect && det.tags && det.tags.length > 0) {
          currentWrongTypes.push(det.tags[0]);
        }
      });

      const newSessionRecord = {
        date: new Date().toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        score: sessionScore,
        total: sessionTotal,
        accuracy: accuracy,
        xpGained: xpGained
      };

      const updatedHistory = {
        totalQuestions: prevHistory.totalQuestions + sessionTotal,
        correctAnswers: prevHistory.correctAnswers + sessionScore,
        wrongTypes: currentWrongTypes,
        records: [newSessionRecord, ...prevHistory.records] // 最新紀錄塞在最前面
      };

      syncToStorage(newXp, newLevel, updatedHistory);
      return updatedHistory;
    });
  };

  // 🔑 基於 Fisher-Yates 洗牌演算法的高效率隨機出題機制
  const getShuffledQuestions = (limit = 5) => {
    const shuffled = [...rawQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 原地洗牌交換元素
    }
    return shuffled.slice(0, limit);
  };

  // 統計前三名最常踩中的媒體識讀弱點特徵
  const getTopWeaknesses = () => {
    const counts = {};
    history.wrongTypes.forEach((tag) => { counts[tag] = (counts[tag] || 0) + 1; });
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 3);
  };

  // 清空硬碟資料重開機
  const resetHistory = async () => {
    try {
      await AsyncStorage.removeItem('@fake_news_app_storage');
      setXp(0);
      setLevel('識讀實習生');
      setHistory({ totalQuestions: 0, correctAnswers: 0, wrongTypes: [], records: [] });
    } catch (error) {
      console.error('[QuizContext] 數據重置失敗:', error);
    }
  };

  return (
    <QuizContext.Provider value={{ xp, level, history, isLoading, useHintDeduct, saveChallengeSession, getShuffledQuestions, getTopWeaknesses, resetHistory }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (context === undefined) throw new Error('useQuizContext 必須在 QuizProvider 內部使用');
  return context;
};