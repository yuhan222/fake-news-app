// screens/QuizScreen.js
import { ResizeMode, Video } from 'expo-av';
import { ChevronLeft, Lightbulb, Maximize2, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useQuizContext } from '../QuizContext';
import { colors, radius, shadow, spacing } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const localVideoAssets = {
  'assets/n.jpg': require('../assets/n.jpg'),
  'assets/ai 144256.mp4': require('../assets/ai 144256.mp4'),
  'assets/AI炸薯條.mp4': require('../assets/AI炸薯條.mp4'), 
  'assets/153_1.jpg': require('../assets/153_1.jpg'), 
  'assets/4102-2.png': require('../assets/4102-2.png'),
  'assets/8ca4.jpg': require('../assets/8ca4.jpg')
};

export default function QuizScreen({ navigation }) {
  const { getShuffledQuestions, useHintDeduct, saveChallengeSession, xp } = useQuizContext();

  const [questions, setQuestions] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionKey, setSelectedOptionKey] = useState(null); 
  const [isAnswered, setIsAnswered] = useState(false); 
  const [showHint, setShowHint] = useState(false); 
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  
  const [sessionDetails, setSessionDetails] = useState([]); 
  const [sessionScore, setSessionScore] = useState(0);

  useEffect(() => {
    const quizQuestions = getShuffledQuestions(5);
    setQuestions(quizQuestions);
  }, []);

  const currentQuestion = questions[currentIndex];
  const videoRef = useRef(null);
  const lightboxOpacity = useRef(new Animated.Value(0)).current;

  const pinchScaleAnim = useRef(new Animated.Value(1)).current;
  const lastScale = useRef(1);
  const currentPinchScale = useRef(1);

  if (!currentQuestion) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.textSecondary }}>題庫加載中...</Text>
      </SafeAreaView>
    );
  }

  // 🔑 提示點擊事件功能完全綁定修復
  const handleShowHint = () => {
    if (showHint) return;
    if (xp < 15) {
      Alert.alert('查核點數不足', `觀看提示需要扣除 15 XP，您當前只有 ${xp} XP。`);
      return;
    }
    Alert.alert('解鎖事實查核線索', '觀看提示將扣除 15 XP 經驗值，確定要開啟嗎？', [
      { text: '取消', style: 'cancel' },
      { text: '確定扣點', onPress: () => { useHintDeduct(15); setShowHint(true); } }
    ]);
  };

  const handleOptionPress = (option) => {
    if (isAnswered) return;
    setSelectedOptionKey(option.key);
    setIsAnswered(true);

    const isCorrect = option.isCorrect;
    if (isCorrect) setSessionScore(prev => prev + 1);

    setSessionDetails(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        title: currentQuestion.title,
        isCorrect: isCorrect,
        tags: currentQuestion.tags
      }
    ]);
  };

  const handleNext = () => {
    const isLastQuestion = currentIndex === questions.length - 1;
    if (isLastQuestion) {
      const finalScore = sessionScore;
      const finalTotal = questions.length;
      const finalAccuracy = Math.round((finalScore / finalTotal) * 100);
      const finalXpGained = finalScore * 20;

      saveChallengeSession(finalScore, finalTotal, sessionDetails);
      navigation.navigate('Result', { score: finalScore, total: finalTotal, accuracy: finalAccuracy, xpGained: finalXpGained });
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedOptionKey(null);
      setIsAnswered(false);
      setShowHint(false);
      setVideoPlaying(false);
    }
  };

  const openLightbox = () => {
    pinchScaleAnim.setValue(1);
    lastScale.current = 1;
    currentPinchScale.current = 1;
    setLightboxVisible(true);
    Animated.timing(lightboxOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  };

  const closeLightbox = () => {
    Animated.timing(lightboxOpacity, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => { setLightboxVisible(false); });
  };

  const pinchGesture = Gesture.Pinch().onUpdate((e) => {
    const newScale = Math.max(1, Math.min(5, lastScale.current * e.scale));
    currentPinchScale.current = newScale;
    pinchScaleAnim.setValue(newScale);
  }).onEnd(() => { lastScale.current = currentPinchScale.current; });

  const tapGesture = Gesture.Tap().onEnd(() => { if (lastScale.current <= 1.05) closeLightbox(); });
  const composedGesture = Gesture.Simultaneous(pinchGesture, tapGesture);
  const progress = (currentIndex + 1) / questions.length;

  const renderMedia = () => {
    if (!currentQuestion.mediaUrl) return null;
    
    // 🔑 1. 統一在最上方先檢查這個 mediaUrl 字串有沒有在我們的本地對應表中
    const isLocalFile = localVideoAssets[currentQuestion.mediaUrl];
    
    // 🔑 2. 處理圖片區塊
    if (currentQuestion.type === 'image') {
      // 如果在對應表內找到，就用對應表的 require；找不到（例如是網路 http 網址），就走原本的 uri 邏輯
      const imageSource = isLocalFile 
        ? isLocalFile 
        : (typeof currentQuestion.mediaUrl === 'string' ? { uri: currentQuestion.mediaUrl } : currentQuestion.mediaUrl);

      return (
        <TouchableOpacity onPress={openLightbox} activeOpacity={0.92} style={styles.mediaWrapper}>
          {/* 🔑 這裡的 source 要改成我們處理好的 imageSource */}
          <Image source={imageSource} style={styles.media} resizeMode="contain" />
          <View style={styles.expandBadge}>
            <Maximize2 size={12} color="white" />
            <Text style={styles.expandText}>點擊放大</Text>
          </View>
        </TouchableOpacity>
      );
    }
    
    // 🔑 3. 處理影片區塊
    if (currentQuestion.type === 'video') {
      const videoSource = isLocalFile 
        ? isLocalFile 
        : (typeof currentQuestion.mediaUrl === 'string' ? { uri: currentQuestion.mediaUrl } : currentQuestion.mediaUrl);

      return (
        <View style={styles.mediaWrapper}>
          <Video
            ref={videoRef}
            style={styles.media}
            source={videoSource} 
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            onPlaybackStatusUpdate={(status) => { if (status.isLoaded) setVideoPlaying(status.isPlaying); }}
            onError={(error) => console.log('🔴 影片播放發生錯誤:', error)}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {lightboxVisible && currentQuestion.mediaUrl && currentQuestion.type === 'image' && (
        <Modal transparent animationType="none" onRequestClose={closeLightbox}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <GestureDetector gesture={composedGesture}>
              <Animated.View style={[styles.lightboxOverlay, { opacity: lightboxOpacity }]}>
                <TouchableOpacity style={styles.lightboxClose} onPress={closeLightbox}>
                  <X color="white" size={22} strokeWidth={2} />
                </TouchableOpacity>
                <View style={styles.lightboxTapArea}>
                  <Animated.Image source={localVideoAssets[currentQuestion.mediaUrl] || { uri: currentQuestion.mediaUrl }} style={[styles.lightboxImage, { transform: [{ scale: pinchScaleAnim }] }]} resizeMode="contain" />
                </View>
              </Animated.View>
            </GestureDetector>
          </GestureHandlerRootView>
        </Modal>
      )}

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ChevronLeft color={colors.textSecondary} size={24} />
        </TouchableOpacity>
        <View style={styles.topCenter}>
          <Text style={styles.topBarTitle}>真假消息挑戰賽</Text>
          <Text style={styles.topBarSub}>第 {currentIndex + 1} / {questions.length} 題</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.progressBg}>
        // ✅ 改成這樣
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardTopLine} />
          <View style={styles.cardHeader}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{currentQuestion.username || '不實訊息辨識'}</Text>
            </View>
            {currentQuestion.userSub && <Text style={styles.userSubText}>({currentQuestion.userSub})</Text>}
          </View>

          {renderMedia()}

          {/* 🔑 文字過長排版緊湊化修復 */}
          <Text style={[styles.scenarioText, currentQuestion.type === 'text' && styles.textOnlyStyle]}>
            {currentQuestion.scenario || currentQuestion.content}
          </Text>
        </View>

        {/* 🔑 修復提示按鈕點擊反應 */}
        <TouchableOpacity style={[styles.hintToggleBox, showHint && styles.hintToggleBoxActive]} onPress={handleShowHint} activeOpacity={0.7}>
          <Lightbulb size={16} color={showHint ? colors.amber : colors.textTertiary} />
          <Text style={[styles.hintToggleText, showHint && { color: colors.amber }]}>
            {showHint ? '事實查核大師線索已解鎖' : '點擊查看提示 (消耗 15 XP)'}
          </Text>
        </TouchableOpacity>

        {showHint && currentQuestion.hint && (
          <View style={styles.hintContentBox}>
            <Text style={styles.hintContentText}>{currentQuestion.hint.text}</Text>
          </View>
        )}

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => {
            const isCurrentSelected = selectedOptionKey === option.key;
            let cardStyle = styles.optionCard;
            let textStyle = styles.optionText;

            if (isAnswered) {
              if (option.isCorrect) {
                cardStyle = [styles.optionCard, styles.optionCorrectCard];
                textStyle = [styles.optionText, styles.optionCorrectText];
              } else if (isCurrentSelected && !option.isCorrect) {
                cardStyle = [styles.optionCard, styles.optionWrongCard];
                textStyle = [styles.optionText, styles.optionWrongText];
              } else {
                cardStyle = [styles.optionCard, { opacity: 0.4 }];
              }
            }

            return (
              <View key={option.key} style={{ marginBottom: 12 }}>
                <TouchableOpacity style={cardStyle} onPress={() => handleOptionPress(option)} activeOpacity={0.8}>
                  <Text style={textStyle}>{option.text}</Text>
                </TouchableOpacity>

                {isAnswered && (isCurrentSelected || option.isCorrect) && (
                  <View style={[styles.feedbackBox, option.isCorrect ? styles.feedbackCorrectBox : styles.feedbackWrongBox]}>
                    <Text style={styles.feedbackTitle}>{option.isCorrect ? '✅ 查核客觀事實：' : '❌ 思考操控盲區：'}</Text>
                    <Text style={styles.feedbackContent}>{option.feedback}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {isAnswered && (
          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>👁️ 總體媒體識讀核心解析：</Text>
            <Text style={styles.explanationContent}>{currentQuestion.explanation}</Text>
          </View>
        )}
      </ScrollView>

      {isAnswered && (
        <View style={styles.bottomNavContainer}>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {currentIndex === questions.length - 1 ? '完成挑戰並解鎖大面板 ➔' : '前進下一題 ➔'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 10, paddingBottom: 12, alignItems: 'center' },
  iconBtn: { width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  topCenter: { alignItems: 'center' },
  topBarTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  topBarSub: { fontSize: 10, color: colors.textTertiary, marginTop: 1 },
  progressBg: { height: 3, backgroundColor: colors.border, marginHorizontal: spacing.lg, borderRadius: radius.full, marginBottom: 12, overflow: 'hidden' },
  progressFill: { height: 3, backgroundColor: colors.primary, borderRadius: radius.full },
  scroll: { padding: spacing.lg, paddingBottom: 100 },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', ...shadow.sm },
  cardTopLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: colors.borderMid },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: 8 },
  tagBadge: { backgroundColor: 'rgba(37,99,235,0.08)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.sm, borderWidth: 0.5, borderColor: colors.primaryBorder },
  tagText: { fontSize: 11, color: colors.primaryLight, fontWeight: '700' },
  userSubText: { fontSize: 11, color: colors.textTertiary, fontWeight: '500' },
  mediaWrapper: { position: 'relative', marginBottom: spacing.sm, borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  media: { width: '100%', height: 150, backgroundColor: '#000000' },
  expandBadge: { position: 'absolute', bottom: 8, right: 8, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.full },
  expandText: { fontSize: 9, color: 'white', fontWeight: '600' },
  scenarioText: { fontSize: 13, lineHeight: 22, color: colors.textSecondary },
  textOnlyStyle: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  hintToggleBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingVertical: 10, borderRadius: radius.md, marginTop: 12, borderStyle: 'dashed' },
  hintToggleBoxActive: { borderColor: colors.amber, backgroundColor: 'rgba(244,162,97,0.03)' },
  hintToggleText: { fontSize: 11, color: colors.textTertiary, fontWeight: '600' },
  hintContentBox: { marginTop: 8, backgroundColor: 'rgba(244,162,97,0.05)', padding: 12, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.amber },
  hintContentText: { fontSize: 12, color: '#F4A261', lineHeight: 20 },
  optionsContainer: { marginTop: 16 },
  optionCard: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, padding: 12, borderRadius: radius.lg, ...shadow.sm },
  optionText: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  optionCorrectCard: { borderColor: colors.success, backgroundColor: colors.successBg },
  optionCorrectText: { color: colors.success, fontWeight: '700' },
  optionWrongCard: { borderColor: colors.danger, backgroundColor: colors.dangerBg },
  optionWrongText: { color: colors.danger, fontWeight: '700' },
  feedbackBox: { marginTop: 6, padding: 10, borderRadius: radius.md, borderWidth: 1 },
  feedbackCorrectBox: { backgroundColor: 'rgba(42,157,143,0.04)', borderColor: 'rgba(42,157,143,0.15)' },
  feedbackWrongBox: { backgroundColor: 'rgba(231,111,81,0.04)', borderColor: 'rgba(231,111,81,0.15)' },
  feedbackTitle: { fontSize: 11, fontWeight: 'bold', marginBottom: 2 },
  feedbackContent: { fontSize: 11, color: colors.textSecondary, lineHeight: 16 },
  explanationCard: { marginTop: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 14, borderRadius: radius.xl },
  explanationTitle: { fontSize: 13, fontWeight: '700', color: colors.primary },
  explanationContent: { fontSize: 12, color: colors.textSecondary, lineHeight: 18, marginTop: 4 },
  bottomNavContainer: { paddingHorizontal: spacing.lg, paddingBottom: 24, paddingTop: 10 },
  nextBtn: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  nextBtnText: { color: 'white', fontSize: 15, fontWeight: '700' },
  lightboxOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.92)', zIndex: 999, justifyContent: 'center', alignItems: 'center' },
  lightboxTapArea: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, justifyContent: 'center', alignItems: 'center' },
  lightboxImage: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.75 },
  lightboxClose: { position: 'absolute', top: 56, right: 20, zIndex: 1000, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' }
});