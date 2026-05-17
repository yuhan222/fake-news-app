import { ResizeMode, Video } from 'expo-av';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Check, ChevronLeft, Maximize2, Play, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { myQuestions } from '../questions';
import { colors, radius, shadow, spacing } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function QuizScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const currentQuestion = myQuestions[currentIndex];
  const videoRef = useRef(null);
  const trueScale = useRef(new Animated.Value(1)).current;
  const fakeScale = useRef(new Animated.Value(1)).current;
  const lightboxOpacity = useRef(new Animated.Value(0)).current;

  // Pinch-to-zoom: 用 useRef 儲存 scale 值，直接操作 Animated.Value
  const pinchScaleAnim = useRef(new Animated.Value(1)).current;
  const lastScale = useRef(1);
  const currentPinchScale = useRef(1);

  const makeScaleHandler = (anim) => ({
    onPressIn: () => Animated.spring(anim, { toValue: 0.94, useNativeDriver: true }).start(),
    onPressOut: () => Animated.spring(anim, { toValue: 1, friction: 4, useNativeDriver: true }).start(),
  });

  const openLightbox = () => {
    pinchScaleAnim.setValue(1);
    lastScale.current = 1;
    currentPinchScale.current = 1;
    setLightboxVisible(true);
    Animated.timing(lightboxOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  };

  const closeLightbox = () => {
    Animated.timing(lightboxOpacity, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
      setLightboxVisible(false);
    });
  };

  // Gesture: pinch 縮放 + tap 關閉，同時運作
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const newScale = Math.max(1, Math.min(5, lastScale.current * e.scale));
      currentPinchScale.current = newScale;
      pinchScaleAnim.setValue(newScale);
    })
    .onEnd(() => {
      lastScale.current = currentPinchScale.current;
    });

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      // 只在沒有縮放時點擊才關閉（避免縮放後誤觸關閉）
      if (lastScale.current <= 1.05) {
        closeLightbox();
      }
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, tapGesture);

  const progress = (currentIndex + 1) / myQuestions.length;

  const renderMedia = () => {
    if (currentQuestion.type === 'image') {
      const src = typeof currentQuestion.mediaUrl === 'string' ? { uri: currentQuestion.mediaUrl } : currentQuestion.mediaUrl;
      return (
        <TouchableOpacity onPress={openLightbox} activeOpacity={0.92} style={styles.mediaWrapper}>
          <Image source={src} style={styles.media} resizeMode="contain" />
          <View style={styles.expandBadge}>
            <Maximize2 size={12} color="white" />
            <Text style={styles.expandText}>點擊放大</Text>
          </View>
        </TouchableOpacity>
      );
    }
    if (currentQuestion.type === 'video') {
      const src = typeof currentQuestion.mediaUrl === 'string' ? { uri: currentQuestion.mediaUrl } : currentQuestion.mediaUrl;
      return (
        <View style={styles.mediaWrapper}>
          <Video
            ref={videoRef}
            style={styles.media}
            source={src}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded) setVideoPlaying(status.isPlaying);
            }}
            onError={(e) => console.error('影片載入失敗：', e)}
          />
          {/* 只在未播放時顯示提示角標 */}
          {!videoPlaying && (
            <View style={styles.expandBadge} pointerEvents="none">
              <Play size={12} color="white" />
              <Text style={styles.expandText}>點擊播放</Text>
            </View>
          )}
        </View>
      );
    }
    return null;
  };

  const handleAnswer = (userChoiceIsFake) => {
    const isCorrect = userChoiceIsFake === currentQuestion.isFake;
    const hasNextQuestion = currentIndex < myQuestions.length - 1;
    navigation.navigate('Result', { isCorrect, questionInfo: currentQuestion, hasNext: hasNextQuestion });
    if (hasNextQuestion) {
      setCurrentIndex(currentIndex + 1);
      setVideoPlaying(false); // 換題時重置播放狀態
    }
  };

  const lightboxSrc = currentQuestion.type === 'image'
    ? (typeof currentQuestion.mediaUrl === 'string' ? { uri: currentQuestion.mediaUrl } : currentQuestion.mediaUrl)
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topGlow} />

      {/* 圖片放大 Modal */}
      {lightboxVisible && lightboxSrc && (
        <Modal transparent animationType="none" onRequestClose={closeLightbox}>
          {/* 將 GestureHandlerRootView 與 GestureDetector 放到最外層，確保手勢完整接收 */}
          <GestureHandlerRootView style={{ flex: 1 }}>
            <GestureDetector gesture={composedGesture}>
              <Animated.View style={[styles.lightboxOverlay, { opacity: lightboxOpacity }]}>
                
                {/* 關閉按鈕 */}
                <TouchableOpacity style={styles.lightboxClose} onPress={closeLightbox}>
                  <X color="white" size={22} strokeWidth={2} />
                </TouchableOpacity>

                {/* 圖片容器：不使用 pointerEvents 阻擋 */}
                <View style={styles.lightboxTapArea}>
                  <Animated.Image
                    source={lightboxSrc}
                    style={[
                      styles.lightboxImage,
                      {
                        transform: [
                          { scale: pinchScaleAnim }
                        ]
                      }
                    ]}
                    resizeMode="contain"
                  />
                </View>

              </Animated.View>
            </GestureDetector>
          </GestureHandlerRootView>
        </Modal>
      )}

      {/* 頂部導覽 */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ChevronLeft color={colors.textSecondary} size={24} />
        </TouchableOpacity>
        <View style={styles.topCenter}>
          <Text style={styles.topBarTitle}>第 {currentIndex + 1} 題</Text>
          <Text style={styles.topBarSub}>共 {myQuestions.length} 題</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* 進度條 */}
      <View style={styles.progressBg}>
        <Animated.View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardTopLine} />
          <View style={styles.cardHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{currentQuestion.username?.charAt(0) || '?'}</Text>
            </View>
            <View>
              <Text style={styles.username}>{currentQuestion.username}</Text>
              <Text style={styles.userSub}>{currentQuestion.userSub}</Text>
            </View>
          </View>

          {renderMedia()}

          <Text style={[styles.postText, currentQuestion.type === 'text' && styles.textOnlyPost]}>
            {currentQuestion.content}
          </Text>
        </View>

        <Text style={styles.hint}>這則訊息是真實的還是造假的？</Text>
      </ScrollView>

      {/* 答題按鈕 */}
      <View style={styles.footer}>
        <Animated.View style={[{ flex: 1 }, { transform: [{ scale: trueScale }] }]}>
          <TouchableOpacity style={[styles.choiceBtn, styles.choiceTrue]}
            onPress={() => handleAnswer(false)} {...makeScaleHandler(trueScale)} activeOpacity={1}>
            <Check color={colors.success} size={22} strokeWidth={2.5} />
            <Text style={[styles.choiceTxt, { color: colors.success }]}>真實</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[{ flex: 1 }, { transform: [{ scale: fakeScale }] }]}>
          <TouchableOpacity style={[styles.choiceBtn, styles.choiceFake]}
            onPress={() => handleAnswer(true)} {...makeScaleHandler(fakeScale)} activeOpacity={1}>
            <X color={colors.danger} size={22} strokeWidth={2.5} />
            <Text style={[styles.choiceTxt, { color: colors.danger }]}>造假</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topGlow: {
    position: 'absolute', top: -60, left: '50%', marginLeft: -100,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(37,99,235,0.07)',
  },

  // Lightbox
  lightboxOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.93)',
    zIndex: 999,
    justifyContent: 'center', alignItems: 'center',
  },
  lightboxTapArea: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.75,
  },
  lightboxClose: {
    position: 'absolute', top: 56, right: 20, zIndex: 1000,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center', alignItems: 'center',
  },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: 10, paddingBottom: 12,
    alignItems: 'center',
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: radius.sm,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  topCenter: { alignItems: 'center' },
  topBarTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  topBarSub: { fontSize: 10, color: colors.textTertiary, marginTop: 1 },

  progressBg: {
    height: 3, backgroundColor: colors.border,
    marginHorizontal: spacing.lg, borderRadius: radius.full, marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3, backgroundColor: colors.primary, borderRadius: radius.full,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 6, elevation: 4,
  },

  scroll: { padding: spacing.lg, paddingBottom: spacing.md },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    padding: spacing.lg, borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.md,
  },
  cardTopLine: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
    backgroundColor: colors.borderMid,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: 12 },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primaryBg,
    borderWidth: 1, borderColor: colors.primaryBorder,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '700', color: colors.primaryLight },
  username: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  userSub: { fontSize: 11, color: colors.textTertiary, marginTop: 1 },

  mediaWrapper: {
    position: 'relative',
    marginBottom: spacing.md,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  media: {
    width: '100%', height: 190,
    backgroundColor: colors.surfaceElevated,
  },
  expandBadge: {
    position: 'absolute', bottom: 8, right: 8,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 9, paddingVertical: 5,
    borderRadius: radius.full,
  },
  expandText: { fontSize: 10, color: 'white', fontWeight: '600' },

  postText: { fontSize: 15, lineHeight: 26, color: colors.textSecondary },
  textOnlyPost: { fontSize: 16, lineHeight: 28, color: colors.textPrimary, fontWeight: '500', paddingVertical: 8 },

  hint: { textAlign: 'center', fontSize: 13, color: colors.textTertiary, fontWeight: '500', marginTop: 14, marginBottom: 4 },

  footer: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingBottom: 28, paddingTop: 10, gap: 12 },
  choiceBtn: {
    paddingVertical: 18, borderRadius: radius.lg,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    borderWidth: 1.5,
  },
  choiceTrue: { backgroundColor: colors.successBg, borderColor: colors.successBorder, ...shadow.success },
  choiceFake: { backgroundColor: colors.dangerBg, borderColor: colors.dangerBorder, ...shadow.danger },
  choiceTxt: { fontSize: 17, fontWeight: '800', letterSpacing: 0.3 },
});