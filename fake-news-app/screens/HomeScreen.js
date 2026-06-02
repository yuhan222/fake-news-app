import React, { useEffect, useRef } from 'react';
import { Animated, Easing, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'; // 🔑 確保補上 ScrollView 引入
import { BarChart2, ChevronRight, Leaf, Sprout, TreeDeciduous, Trophy, Zap, ShieldCheck } from 'lucide-react-native';
import { useQuizContext } from '../QuizContext'; 
import { colors, radius, shadow, spacing } from '../theme';

export default function HomeScreen({ navigation }) {
  // --- 1. 從全域大腦中提取真實的持久化養成進度與歷史紀錄 ---
  const { history, xp, level } = useQuizContext();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.88)).current;
  const btn1Scale = useRef(new Animated.Value(1)).current;
  const btn2Scale = useRef(new Animated.Value(1)).current;
  const btn3Scale = useRef(new Animated.Value(1)).current;

  const accuracy = history.totalQuestions === 0
    ? 0
    : Math.round((history.correctAnswers / history.totalQuestions) * 100);

  // --- 2. 將植物養成階段與全域真實段位（level）進行融合綁定 ---
  let plantConfig = {
    icon: Sprout,
    color: colors.textTertiary,
    borderColor: colors.border,
    bgColor: colors.surface,
    stage: '種子發芽期',
    text: `當前經驗值 ${xp} XP。快去挑戰，幫我的防詐大樹澆水吧！`,
  };

  if (level === '事實查核專家') {
    plantConfig = { 
      icon: TreeDeciduous, 
      color: '#34D399', 
      borderColor: 'rgba(52,211,153,0.3)', 
      bgColor: 'rgba(52,211,153,0.1)', 
      stage: '事實查核專家 (神木期)', 
      text: `達最高階 ${xp} XP！您已長成抗詐神木，具備頂級媒體免疫力！` 
    };
  } else if (level === '新手偵探') {
    plantConfig = { 
      icon: Leaf, 
      color: colors.success, 
      borderColor: colors.successBorder, 
      bgColor: colors.successBg, 
      stage: '新手偵探 (抽葉期)', 
      text: `已累積 ${xp} XP！查核嫩芽已抽葉成長，請繼續保持警覺！` 
    };
  } else {
    if (history.totalQuestions > 0) {
      plantConfig = { 
        icon: Sprout, 
        color: '#6EE7B7', 
        borderColor: 'rgba(110,231,183,0.25)', 
        bgColor: 'rgba(110,231,183,0.08)', 
        stage: '網路小白 (萌芽期)', 
        text: `累積 ${xp} XP。查核正確率 ${accuracy}%，建議多到學習模式補強！` 
      };
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
      <View style={styles.topGlow} />

      <ScrollView 
        contentContainerStyle={[styles.scrollContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 🏷️ 大標題 */}
        <View style={styles.header}>
          <Text style={styles.title}>真假之眼</Text>
          <Text style={styles.subtitle}>眼前所見，並非真實</Text>
        </View>

        {/* 📊 數據看板列 */}
        {history.totalQuestions > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{history.totalQuestions}</Text>
              <Text style={styles.statLabel}>總答題數</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: colors.success }]}>{history.correctAnswers}</Text>
              <Text style={styles.statLabel}>答對題數</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: accuracy >= 60 ? colors.primaryLight : colors.danger }]}>{accuracy}%</Text>
              <Text style={styles.statLabel}>綜合正確率</Text>
            </View>
          </View>
        )}

        {/* 🗺️ 主導航選單按鈕清單 */}
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
                <View style={styles.btnLeft}><Zap size={19} color={colors.primaryLight} /><Text style={styles.btnTextSecondary}>自主學習</Text></View>
                <ChevronRight size={17} color={colors.primaryBorder} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: btn3Scale }] }}>
            <TouchableOpacity style={styles.btnGhost} onPress={() => navigation.navigate('History')} {...makeScaleHandler(btn3Scale)} activeOpacity={1}>
              <View style={styles.btnInner}>
                <View style={styles.btnLeft}><BarChart2 size={19} color={colors.textTertiary} /><Text style={styles.btnTextGhost}>數據足跡中心</Text></View>
                <ChevronRight size={17} color={colors.textTertiary} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* 🌱 植物養成 Hero 區塊 */}
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
            <ShieldCheck size={12} color={plantConfig.color} style={{ marginRight: 2 }} />
            <Text style={[styles.stageText, { color: plantConfig.color }]}>{plantConfig.stage}</Text>
          </View>

          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>{plantConfig.text}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContainer: { 
    paddingHorizontal: spacing.lg, 
    paddingTop: spacing.lg, 
    paddingBottom: spacing.xl 
  },
  topGlow: {
    position: 'absolute', top: -80, left: '50%', marginLeft: -150,
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(37,99,235,0.08)',
  },
  header: { paddingBottom: spacing.sm, alignItems: 'center' },
  eyebrow: { fontSize: 11, fontWeight: '700', color: colors.primaryLight, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  title: { fontSize: 32, fontWeight: '900', color: colors.textPrimary, letterSpacing: -0.5, marginBottom: 6 },
  subtitle: { fontSize: 13, color: colors.textSecondary, fontWeight: '400' },

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

  menu: { gap: spacing.sm, paddingBottom: spacing.md },
  btnPrimary: {
    backgroundColor: colors.primaryDark, borderRadius: radius.lg,
    paddingVertical: 18, paddingHorizontal: spacing.lg,
    borderWidth: 1, borderColor: colors.primaryBorder,
  },
  btnSecondary: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    paddingVertical: 18, paddingHorizontal: spacing.lg,
    borderWidth: 1, borderColor: colors.primaryBorder,
  },
  btnGhost: {
    borderRadius: radius.lg,
    paddingVertical: 16, paddingHorizontal: spacing.lg,
  },
  btnInner:{ flexDirection: 'row', alignItems: 'center', justifyContext: 'space-between' },
  btnLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  btnTextPrimary: { fontSize: 16, fontWeight: '700', color: 'white' },
  btnTextSecondary: { fontSize: 16, fontWeight: '700', color: colors.primaryLight },
  btnTextGhost: { fontSize: 16, fontWeight: '600', color: colors.textTertiary },
  
  hero: { alignItems: 'center', marginTop: spacing.md, paddingBottom: spacing.md },
  plantRing: { width: 90, height: 90, borderRadius: 45, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 12, ...shadow.sm },
  stagePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full, borderWidth: 1, marginBottom: 10 },
  stageText: { fontSize: 11, fontWeight: '700' },
  speechBubble: { backgroundColor: colors.surface, paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, maxWidth: '85%' },
  speechText: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 }
});