import { BarChart2, ChevronRight, Leaf, Sprout, TreeDeciduous, Trophy, Zap } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Easing, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQuizContext } from '../QuizContext';
import { colors, radius, shadow, spacing } from '../theme';

export default function HomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.88)).current;
  const btn1Scale = useRef(new Animated.Value(1)).current;
  const btn2Scale = useRef(new Animated.Value(1)).current;
  const btn3Scale = useRef(new Animated.Value(1)).current;

  const { history } = useQuizContext();
  const accuracy = history.totalQuestions === 0
    ? 0
    : Math.round((history.correctAnswers / history.totalQuestions) * 100);

  let plantConfig = {
    icon: Sprout,
    color: colors.success,
    glowColor: 'rgba(16,185,129,0.2)',
    borderColor: colors.successBorder,
    bgColor: colors.successBg,
    stage: '種子期',
    text: '快去挑戰，給我澆水吧！',
  };
  if (history.totalQuestions > 0) {
    if (accuracy >= 80) {
      plantConfig = { icon: TreeDeciduous, color: '#34D399', glowColor: 'rgba(52,211,153,0.2)', borderColor: 'rgba(52,211,153,0.3)', bgColor: 'rgba(52,211,153,0.1)', stage: '大樹期', text: `正確率 ${accuracy}%，已是防詐高手！` };
    } else if (accuracy >= 50) {
      plantConfig = { icon: Leaf, color: colors.success, glowColor: 'rgba(16,185,129,0.2)', borderColor: colors.successBorder, bgColor: colors.successBg, stage: '成長期', text: `正確率 ${accuracy}%，繼續加油！` };
    } else {
      plantConfig = { icon: Sprout, color: '#6EE7B7', glowColor: 'rgba(110,231,183,0.15)', borderColor: 'rgba(110,231,183,0.25)', bgColor: 'rgba(110,231,183,0.08)', stage: '發芽期', text: `正確率 ${accuracy}%，先去學習補強！` };
    }
  }
  const PlantIcon = plantConfig.icon;

  const makeScaleHandler = (anim) => ({
    onPressIn: () => Animated.spring(anim, { toValue: 0.95, useNativeDriver: true }).start(),
    onPressOut: () => Animated.spring(anim, { toValue: 1, friction: 4, useNativeDriver: true }).start(),
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 10, tension: 45, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* 頂部裝飾光暈 */}
      <View style={styles.topGlow} />

      <Animated.View style={[styles.inner, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        {/* Hero */}
        <View style={styles.hero}>
          <Animated.View style={[
            styles.plantRing,
            {
              backgroundColor: plantConfig.bgColor,
              borderColor: plantConfig.borderColor,
              shadowColor: plantConfig.color,
              transform: [{ translateY: floatAnim }, { scale: scaleAnim }],
            }
          ]}>
            <PlantIcon color={plantConfig.color} size={46} strokeWidth={1.8} />
          </Animated.View>

          <View style={[styles.stagePill, { borderColor: plantConfig.borderColor }]}>
            <View style={[styles.stageDot, { backgroundColor: plantConfig.color }]} />
            <Text style={[styles.stageText, { color: plantConfig.color }]}>{plantConfig.stage}</Text>
          </View>

          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>{plantConfig.text}</Text>
          </View>
        </View>

        {/* 標題 */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>真假辨別訓練</Text>
          <Text style={styles.title}>真假之眼 </Text>
          <Text style={styles.subtitle}>你能看穿社群中的謊言嗎？</Text>
        </View>

        {/* 統計列 */}
        {history.totalQuestions > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{history.totalQuestions}</Text>
              <Text style={styles.statLabel}>已答題數</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: colors.success }]}>{history.correctAnswers}</Text>
              <Text style={styles.statLabel}>答對題數</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: accuracy >= 60 ? colors.primaryLight : colors.danger }]}>{accuracy}%</Text>
              <Text style={styles.statLabel}>正確率</Text>
            </View>
          </View>
        )}

        {/* 按鈕 */}
        <View style={styles.menu}>
          <Animated.View style={{ transform: [{ scale: btn1Scale }] }}>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Quiz')} {...makeScaleHandler(btn1Scale)} activeOpacity={1}>
              <View style={styles.btnInner}>
                <View style={styles.btnLeft}><Trophy size={19} color="white" /><Text style={styles.btnTextPrimary}>開始挑戰</Text></View>
                <ChevronRight size={17} color="rgba(255,255,255,0.4)" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: btn2Scale }] }}>
            <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.navigate('Learning')} {...makeScaleHandler(btn2Scale)} activeOpacity={1}>
              <View style={styles.btnInner}>
                <View style={styles.btnLeft}><Zap size={19} color={colors.primaryLight} /><Text style={styles.btnTextSecondary}>學習模式</Text></View>
                <ChevronRight size={17} color={colors.primaryBorder} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: btn3Scale }] }}>
            <TouchableOpacity style={styles.btnGhost} onPress={() => navigation.navigate('History')} {...makeScaleHandler(btn3Scale)} activeOpacity={1}>
              <View style={styles.btnInner}>
                <View style={styles.btnLeft}><BarChart2 size={19} color={colors.textTertiary} /><Text style={styles.btnTextGhost}>我的紀錄</Text></View>
                <ChevronRight size={17} color={colors.textTertiary} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topGlow: {
    position: 'absolute', top: -80, left: '50%', marginLeft: -150,
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(37,99,235,0.08)',
  },
  inner: { flex: 1, paddingHorizontal: spacing.lg },

  hero: { alignItems: 'center', paddingTop: spacing.xl, paddingBottom: spacing.lg },
  plantRing: {
    width: 104, height: 104, borderRadius: 52,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, marginBottom: spacing.sm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 24, elevation: 10,
  },
  stagePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.surface,
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: radius.full, borderWidth: 1,
    marginBottom: spacing.sm,
  },
  stageDot: { width: 5, height: 5, borderRadius: 3 },
  stageText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  speechBubble: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md, paddingVertical: 9,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    maxWidth: 240,
  },
  speechText: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', fontWeight: '500', lineHeight: 18 },

  header: { paddingBottom: spacing.md },
  eyebrow: { fontSize: 11, fontWeight: '700', color: colors.primaryLight, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  title: { fontSize: 34, fontWeight: '900', color: colors.textPrimary, letterSpacing: -0.5, marginBottom: 7 },
  subtitle: { fontSize: 14, color: colors.textSecondary, fontWeight: '400' },

  statsRow: {
    flexDirection: 'row', backgroundColor: colors.surface,
    borderRadius: radius.lg, paddingVertical: 14,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border,
    ...shadow.sm,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: 3 },
  statLabel: { fontSize: 10, color: colors.textTertiary, fontWeight: '600' },
  statDivider: { width: 1, backgroundColor: colors.border },

  menu: { gap: spacing.sm, paddingBottom: spacing.xl },
  btnPrimary: {
    backgroundColor: colors.primaryDark, borderRadius: radius.lg,
    paddingVertical: 18, paddingHorizontal: spacing.lg,
    borderWidth: 1, borderColor: colors.primaryBorder,
    ...shadow.primary,
  },
  btnSecondary: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    paddingVertical: 18, paddingHorizontal: spacing.lg,
    borderWidth: 1, borderColor: colors.primaryBorder,
    ...shadow.sm,
  },
  btnGhost: {
    borderRadius: radius.lg,
    paddingVertical: 16, paddingHorizontal: spacing.lg,
  },
  btnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  btnLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  btnTextPrimary: { fontSize: 16, fontWeight: '700', color: 'white' },
  btnTextSecondary: { fontSize: 16, fontWeight: '700', color: colors.primaryLight },
  btnTextGhost: { fontSize: 16, fontWeight: '600', color: colors.textTertiary },
});
