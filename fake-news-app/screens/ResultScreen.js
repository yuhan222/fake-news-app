import { AlertCircle, CheckCircle, Ghost, Share2, Tag } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, SafeAreaView, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQuizContext } from '../QuizContext';
import { colors, radius, shadow, spacing } from '../theme';

export default function ResultScreen({ route, navigation }) {
  const { isCorrect = false, questionInfo = {}, hasNext = false } = route.params || {};
  const { addRecord } = useQuizContext();

  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (questionInfo.tags) addRecord(isCorrect, questionInfo.tags);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `我在「真假之眼」答題${isCorrect ? '正確' : '錯誤'}！正確答案是「${questionInfo.isFake ? '造假訊息' : '真實訊息'}」。快來測試你的防詐能力！`,
      });
    } catch (e) { console.log(e); }
  };

  const handleNext = () => {
    if (hasNext) {
      navigation.goBack();
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'History' }] });
    }
  };

  const accentColor = isCorrect ? colors.success : colors.danger;
  const accentBg = isCorrect ? colors.successBg : colors.dangerBg;
  const accentBorder = isCorrect ? colors.successBorder : colors.dangerBorder;
  const accentShadow = isCorrect ? shadow.success : shadow.danger;

  return (
    <SafeAreaView style={styles.container}>
      {/* 頂部結果光暈 */}
      <View style={[styles.resultGlow, { backgroundColor: isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }]} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* 結果標頭 */}
          <View style={[styles.headerCard, { borderColor: accentBorder, backgroundColor: accentBg }]}>
            <View style={[styles.cardTopLine, { backgroundColor: accentBorder }]} />

            <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
              {isCorrect
                ? <CheckCircle color={colors.success} size={62} strokeWidth={1.5} />
                : <AlertCircle color={colors.danger} size={62} strokeWidth={1.5} />
              }
            </Animated.View>

            <Text style={[styles.statusText, { color: accentColor }]}>
              {isCorrect ? '判斷正確！' : '判斷錯誤'}
            </Text>

            <View style={[styles.answerBadge, { backgroundColor: colors.surface, borderColor: accentBorder }]}>
              <Text style={[styles.answerText, { color: accentColor }]}>
                正確解答：{questionInfo.isFake ? '造假訊息' : '真實訊息'}
              </Text>
            </View>
          </View>

          {/* 真相解析（含標籤） */}
          <View style={styles.infoBox}>
            <View style={styles.cardTopLine} />
            <View style={styles.boxHeader}>
              <View style={[styles.boxDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.boxTitle}>真相解析</Text>
            </View>
            <Text style={styles.infoText}>{questionInfo.explanation || '這則訊息屬於假訊息。'}</Text>

            {/* 標籤區塊（從題目移至此處） */}
            {questionInfo.tags && questionInfo.tags.length > 0 && (
              <View style={styles.tagsSection}>
                <View style={styles.tagsSectionHeader}>
                  <Tag size={12} color={colors.textTertiary} />
                  <Text style={styles.tagsSectionLabel}>識別關鍵字</Text>
                </View>
                <View style={styles.tags}>
                  {questionInfo.tags.map(tag => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* 詐騙者視角 */}
          {questionInfo.isFake && (
            <View style={styles.scammerBox}>
              <View style={styles.scammerHeader}>
                <Ghost color="#F87171" size={16} />
                <Text style={styles.scammerTitle}>詐騙者視角：他們怎麼騙你的？</Text>
              </View>
              <View style={styles.scammerDivider} />
              {(questionInfo.scammerPerspective || '• 利用情緒操控讓你失去理智判斷。')
                .split('\n')
                .map((line, i) => {
                  const colonIdx = line.indexOf('：');
                  if (colonIdx === -1) return (
                    <Text key={i} style={styles.scammerText}>{line}</Text>
                  );
                  const bold = line.slice(0, colonIdx + 1);
                  const rest = line.slice(colonIdx + 1);
                  return (
                    <Text key={i} style={[styles.scammerText, { marginBottom: 6 }]}>
                      <Text style={styles.scammerBold}>{bold}</Text>
                      {rest}
                    </Text>
                  );
                })
              }
            </View>
          )}

          {/* 分享 */}
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Share2 size={15} color={colors.textTertiary} />
            <Text style={styles.shareText}>分享結果給朋友考考他</Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>

      {/* 底部按鈕 */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.nextBtn, { borderColor: accentBorder, ...accentShadow }]} onPress={handleNext} activeOpacity={0.85}>
          <Text style={[styles.nextText, { color: accentColor }]}>{hasNext ? '繼續下一題' : '查看最終結果'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  resultGlow: {
    position: 'absolute', top: -80, left: '50%', marginLeft: -150,
    width: 300, height: 300, borderRadius: 150,
  },
  scroll: { padding: spacing.lg, paddingBottom: 16 },

  headerCard: {
    alignItems: 'center', padding: 28, borderRadius: radius.xl,
    borderWidth: 1.5, marginBottom: spacing.md, gap: 12,
    overflow: 'hidden',
    ...shadow.md,
  },
  cardTopLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 1 },
  statusText: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  answerBadge: {
    paddingHorizontal: 18, paddingVertical: 8,
    borderRadius: radius.full, borderWidth: 1,
  },
  answerText: { fontSize: 13, fontWeight: '700' },

  infoBox: {
    backgroundColor: colors.surface, padding: spacing.lg,
    borderRadius: radius.lg, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.sm,
  },
  boxHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  boxDot: { width: 6, height: 6, borderRadius: 3 },
  boxTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  infoText: { fontSize: 14, lineHeight: 24, color: colors.textSecondary },

  // 標籤區塊樣式
  tagsSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tagsSectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginBottom: 10,
  },
  tagsSectionLabel: {
    fontSize: 11, color: colors.textTertiary, fontWeight: '600', letterSpacing: 0.3,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  tag: {
    backgroundColor: colors.primaryBg, paddingHorizontal: 11, paddingVertical: 5,
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.primaryBorder,
  },
  tagText: { fontSize: 11, color: colors.primaryLight, fontWeight: '600' },

  scammerBox: {
    backgroundColor: colors.dark, padding: spacing.lg,
    borderRadius: radius.lg, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.darkBorder,
    ...shadow.sm,
  },
  scammerHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  scammerDivider: { height: 1, backgroundColor: colors.darkBorder, marginBottom: 12 },
  scammerTitle: { fontSize: 13, fontWeight: '700', color: '#F87171' },
  scammerText: { fontSize: 13, lineHeight: 22, color: '#94A3B8' },
  scammerBold: { fontWeight: '800', color: '#F87171' },

  shareBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, paddingVertical: 14,
  },
  shareText: { fontSize: 13, color: colors.textTertiary, fontWeight: '500' },

  footer: { paddingHorizontal: spacing.lg, paddingBottom: 24, paddingTop: 8 },
  nextBtn: {
    backgroundColor: colors.surface, paddingVertical: 18,
    borderRadius: radius.lg, alignItems: 'center',
    borderWidth: 1.5,
  },
  nextText: { fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
});