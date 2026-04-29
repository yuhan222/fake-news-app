import { createContext, useContext, useState } from 'react';

// 1. 建立 QuizContext (全域狀態容器)
const QuizContext = createContext();

// 2. 建立 Provider 元件，用來包覆整個應用程式並供應資料
export const QuizProvider = ({ children }) => {
  // 定義 history 狀態，用來儲存學習數據
  const [history, setHistory] = useState({
    totalQuestions: 0,    // 總共回答的題數
    correctAnswers: 0,    // 答對的題數
    wrongTypes: [],       // 所有答錯題目的標籤 (Tags) 收集
  });

  /**
   * 新增一筆答題紀錄
   * @param {boolean} isCorrect - 使用者是否答對
   * @param {Array<string>} tags - 該題目的標籤陣列，例如 ['內容離譜', '引導嘗試']
   */
  const addRecord = (isCorrect, tags) => {
    setHistory((prevHistory) => {
      // 複製一份舊的錯誤標籤陣列
      let newWrongTypes = [...prevHistory.wrongTypes];
      
      // 如果答錯了，將這題的所有標籤加入錯誤類型清單中
      if (!isCorrect && tags && Array.isArray(tags)) {
        newWrongTypes = [...newWrongTypes, ...tags];
      }

      // 回傳更新後的狀態
      return {
        totalQuestions: prevHistory.totalQuestions + 1,
        correctAnswers: prevHistory.correctAnswers + (isCorrect ? 1 : 0),
        wrongTypes: newWrongTypes,
      };
    });
  };

  /**
   * 取得需要加強的題型（錯誤次數最多的前 3 名標籤）
   * @returns {Array<string>} - 回傳前三名最常錯的標籤字串陣列
   */
  const getTopWeaknesses = () => {
    const counts = {};
    
    // 計算每個錯誤標籤出現的次數
    history.wrongTypes.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
    
    // 將物件轉換為陣列，依錯誤次數遞減排序，並取出前三名的標籤名稱
    return Object.keys(counts)
      .sort((a, b) => counts[b] - counts[a])
      .slice(0, 3);
  };

  /**
   * 重置所有學習紀錄（可選功能：讓使用者可以重新開始）
   */
  const resetHistory = () => {
    setHistory({
      totalQuestions: 0,
      correctAnswers: 0,
      wrongTypes: [],
    });
  };

  // 將資料與方法透過 value 傳遞給被 Provider 包覆的所有子元件
  return (
    <QuizContext.Provider 
      value={{ 
        history, 
        addRecord, 
        getTopWeaknesses,
        resetHistory // 暴露重置方法供外部使用
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

// 3. 建立並匯出 Custom Hook，方便其他元件快速取用 QuizContext
export const useQuizContext = () => {
  const context = useContext(QuizContext);
  
  // 安全機制：如果在 Provider 外部呼叫此 Hook，則拋出錯誤提醒開發者
  if (context === undefined) {
    throw new Error('useQuizContext 必須在 QuizProvider 內部使用');
  }
  
  return context;
};