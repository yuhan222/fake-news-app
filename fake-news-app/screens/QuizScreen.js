import { ResizeMode, Video } from 'expo-av';
import { Check, ChevronLeft, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Animated, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { myQuestions } from '../questions';
import { colors, radius, shadow, spacing } from '../theme';

export default function QuizScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = myQuestions[currentIndex];
  const videoRef = useRef(null);
  const trueScale = useRef(new Animated.Value(1)).current;
  const fakeScale = useRef(new Animated.Value(1)).current;

  const makeScaleHandler = (anim) => ({
    onPressIn: () => Animated.spring(anim, { toValue: 0.94, useNativeDriver: true }).start(),
    onPressOut: () => Animated.spring(anim, { toValue: 1, friction: 4, useNativeDriver: true }).start(),
  });

  const progress = (currentIndex + 1) / myQuestions.length;

  const renderMedia = () => {
    if (currentQuestion.type === 'image') {
      const src = typeof currentQuestion.mediaUrl === 'string' ? { uri: currentQuestion.mediaUrl } : currentQuestion.mediaUrl;
      return <Image source={src} style={styles.media} resizeMode="contain" />;
    }
    if (currentQuestion.type === 'video') {
      const src = typeof currentQuestion.mediaUrl === 'string' ? { uri: currentQuestion.mediaUrl } : currentQuestion.mediaUrl;
      return (
        <Video ref={videoRef} style={styles.media} source={src}
          useNativeControls resizeMode={ResizeMode.CONTAIN} isLooping
          onError={(e) => console.error('影片載入失敗：', e)} />
      );
    }
    return null;
  };

  const handleAnswer = (userChoiceIsFake) => {
    const isCorrect = userChoiceIsFake === currentQuestion.isFake;
    const hasNextQuestion = currentIndex < myQuestions.length - 1;
    navigation.navigate('Result', { isCorrect, questionInfo: currentQuestion, hasNext: hasNextQuestion });
    if (hasNextQuestion) setCurrentIndex(currentIndex + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topGlow} />

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
        {/* 題目卡 */}
        <View style={styles.card}>
          {/* 卡片頂部光線 */}
          <View style={styles.cardTopLine} />

          <View style={styles.cardHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{currentQuestion.username?.charAt(0) || '?'}</Text>
            </View>
            <View>
              <Text style={styles.username}>{currentQuestion.username}</Text>
              <Text style={styles.userSub}>社群貼文</Text>
            </View>
          </View>

          {renderMedia()}

          <Text style={[styles.postText, currentQuestion.type === 'text' && styles.textOnlyPost]}>
            {currentQuestion.content}
          </Text>

          <View style={styles.tags}>
            {currentQuestion.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
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

  media: { width: '100%', height: 190, borderRadius: radius.md, marginBottom: spacing.md, backgroundColor: colors.surfaceElevated },

  postText: { fontSize: 15, lineHeight: 26, color: colors.textSecondary },
  textOnlyPost: { fontSize: 16, lineHeight: 28, color: colors.textPrimary, fontWeight: '500', paddingVertical: 8 },

  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: spacing.md },
  tag: {
    backgroundColor: colors.primaryBg, paddingHorizontal: 11, paddingVertical: 5,
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.primaryBorder,
  },
  tagText: { fontSize: 11, color: colors.primaryLight, fontWeight: '600' },

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
