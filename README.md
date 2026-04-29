# fake-news-app

**在terminal輸入npm start後可以打開localhost連結，也可以在手機下載expo go掃碼(要相同網路)**

目前題庫是只有八題，我覺得我們可以多新增一點然後讓系統隨機出題

基本上要新增題庫就照questions.js前面的範例就好

我覺得還可以新增資料持久化的功能，因為現在重開 App 所有學習紀錄都歸零，只存在React state，應該可以把紀錄儲存到手機本地，這樣重開就不會消失，不過我還不知道要怎麼做，但這可以最後再弄

/screens
      
       HistoryScreen.js：答題記錄頁面
       
       HomeScreen.js：首頁

       LearningScreen.js：學習模式頁面

       QuizScreen.js：挑戰模式頁面

       ResultScreen.js：解析頁面

/root

      questions.js：題庫

      QuizContext.js：程式記錄使用者答案並分析

      theme.js：儲存畫面所有顏色、陰影、圓角集中管理

/assets：儲存題庫裡需要用到的圖片及影片


