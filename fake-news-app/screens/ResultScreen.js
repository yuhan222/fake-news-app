// screens/ResultScreen.js
import React, { useEffect, useRef } from 'react';
import { ScrollView, Animated, SafeAreaView,  Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AlertCircle, CheckCircle, Ghost, Share2, Tag, Trophy, TrendingUp } from 'lucide-react-native';
import { useQuizContext } from '../QuizContext'; // 引入全域狀態大腦
import { colors, radius, shadow, spacing } from '../theme';

export default function ResultScreen({ route, navigation }) {
  // --- 🔑 核心調整：改為接收整輪測驗的數據（防禦 null 崩潰） ---
  const { 
    score = 0, 
    total = 5, 
    accuracy = 0, 
    xpGained = 0 
  } = route.params || {};

  const { level, xp } = useQuizContext(); // 獲取最新的全域養成稱號與總經驗值

  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // 執行精美的彈入與淡入動畫
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  // 社群社交連結分享功能 (呼應自我決定論中的 Relatedness 社交需求)
  const handleShare = async () => {
    try {
      await Share.share({
        message: `我在反假訊息 App「真假之眼」完成了挑戰測試！正確率高達 ${accuracy}%，一舉獲得了 ${xpGained} XP！目前段位是【${level}】。快來測試你的防詐反射弧吧！`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleNext = () => {
    // 挑戰結算完畢後，一鍵導向歷史數據中心查看 AsyncStorage 的持久化足跡紀錄
    navigation.reset({ index: 0, routes: [{ name: 'History' }] });
  };

  // 根據這輪表現決定視覺主調 (若答對過半則使用成功綠，否則使用警告橘)
  const isPass = accuracy >= 60;
  const accentColor = isPass ? colors.success : colors.warning || '#F4A261';
  const accentBg = isPass ? colors.successBg : colors.warningBg || 'rgba(244,162,97,0.05)';
  const accentBorder = isPass ? colors.successBorder : colors.warningBorder || 'rgba(244,162,97,0.3)';
  const accentShadow = isPass ? shadow.success : shadow.md;

  return (
    <SafeAreaView style={styles.container}>
      {/* 頂部動態光暈 */}
      <View style={[styles.resultGlow, { backgroundColor: isPass ? 'rgba(42,157,143,0.06)' : 'rgba(244,162,97,0.06)' }]} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* 🏆 挑戰模式終點大面板 */}
          <View style={[styles.headerCard, { borderColor: accentBorder, backgroundColor: accentBg }]}>
            <View style={[styles.cardTopLine, { backgroundColor: accentBorder }]} />

            <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
              <Trophy color={accentColor} size={64} strokeWidth={1.5} style={styles.trophyIcon} />
            </Animated.View>

            <Text style={[styles.statusText, { color: accentColor }]}>
              挑戰模式測試結算
            </Text>

            <Text style={styles.scoreText}>
              答對 <Text style={{ color: accentColor, fontSize: 32 }}>{score}</Text> / {total} 題
            </Text>

            <View style={[styles.answerBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={styles.answerText}>
                本輪正確率：<Text style={{ color: isPass ? colors.success : colors.danger, fontWeight: '900' }}>{accuracy}%</Text>
              </Text>
            </View>
          </View>

          {/* ⚡ 遊戲化獎勵結算卡片 */}
          <View style={styles.infoBox}>	
            <View style={styles.cardTopLine} />
            {/* 🔑 修正點：將原本爆掉的 <div> 改回 React Native 的 <View> */}
            <View style={styles.boxHeader}>
              <TrendingUp color={colors.primaryLight} size={16} />
              <Text style={styles.boxTitle}>偵探查核經驗值結算</Text>
            </View>
            
            <View style={styles.xpRewardRow}>
              <View>
                <Text style={styles.xpRewardLabel}>本輪獲得獎勵</Text>
                <Text style={styles.xpRewardValue}>+{xpGained} XP</Text>
              </View>
              <View style={styles.xpDivider} />
              <View>
                <Text style={styles.xpRewardLabel}>當前總經驗值</Text>
                <Text style={[styles.xpRewardValue, { color: colors.primaryLight }]}>{xp} XP</Text>
              </View>
            </View>

            {/* 動態防詐標籤區塊 */}
            <View style={styles.tagsSection}>
              <View style={styles.tagsSectionHeader}>
                <Tag size={12} color={colors.textTertiary} />
                <Text style={styles.tagsSectionLabel}>當前偵探執照階級</Text>
              </View>
              <View style={styles.tags}>
                <View style={[styles.tag, { borderColor: colors.primaryBorder, backgroundColor: colors.primaryBg }]}>
                  <Text style={styles.tagText}>【{level}】</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 🕵️ 核心特色展示：詐騙者設計心理學剖析 */}
          <View style={styles.scammerBox}>
            <View style={styles.scammerHeader}>
              <Ghost color="#F87171" size={16} />
              <Text style={styles.scammerTitle}>🕵️ 詐騙者設計心理學反思剖析</Text>
            </View>
            <View style={styles.scammerDivider} />
            <Text style={styles.scammerText}>
              高混淆情境通常精準利用民眾對<Text style={styles.scammerBold}>「急迫時限的恐懼（如斷電、提卡、收押）」</Text>或對<Text style={styles.scammerBold}>「低成本高報酬的從眾心理（如假廣告留言、海外高薪）」</Text>切斷理智。透過本輪隨機盲測，能有效為大腦建構防詐反射弧。
            </Text>
          </View>

          {/* 分享連結 */}
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Share2 size={15} color={colors.textTertiary} />
            <Text style={styles.shareText}>分享成就到 LINE 群組邀請親友挑戰</Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>

      {/* 底部導覽大按鈕 */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.nextBtn, { borderColor: colors.primaryBorder, ...shadow.primary }]} onPress={handleNext} activeOpacity={0.85}>
          <Text style={[styles.nextText, { color: colors.primaryLight }]}>查看數據中心歷史足跡 ➔</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  resultGlow: { position: 'absolute', top: -80, left: '50%', marginLeft: -150, width: 300, height: 300, borderRadius: 150 },
  scroll: { padding: spacing.lg, paddingBottom: 40 },

  headerCard: { alignItems: 'center', padding: 24, borderRadius: radius.xl, borderWidth: 1.5, marginBottom: spacing.md, gap: 8, overflow: 'hidden', ...shadow.md },
  cardTopLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 1 },
  trophyIcon: { marginBottom: 4 },
  statusText: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  scoreText: { fontSize: 16, color: colors.textSecondary, fontWeight: '600', marginVertical: 4 },
  answerBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: radius.full, borderWidth: 1 },
  answerText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },

  infoBox: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', ...shadow.sm },
  boxHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  boxTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  
  // XP 顯示區塊樣式
  xpRewardRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 4 },
  xpRewardLabel: { fontSize: 11, color: colors.textTertiary, textAlign: 'center', marginBottom: 2 },
  xpRewardValue: { fontSize: 22, fontWeight: '800', color: colors.success, textAlign: 'center' },
  xpDivider: { width: 1, height: 32, backgroundColor: colors.border },

  tagsSection: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  tagsSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 10 },
  tagsSectionLabel: { fontSize: 11, color: colors.textTertiary, fontWeight: '600', letterSpacing: 0.3 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  tag: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.full, borderWidth: 1 },
  tagText: { fontSize: 12, color: colors.primaryLight, fontWeight: 'bold' },

  scammerBox: { backgroundColor: colors.dark || '#1e293b', padding: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.darkBorder || '#334155', ...shadow.sm },
  scammerHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  scammerDivider: { height: 1, backgroundColor: colors.darkBorder || '#334155', marginBottom: 12 },
  scammerTitle: { fontSize: 13, fontWeight: '700', color: '#F87171' },
  scammerText: { fontSize: 13, lineHeight: 22, color: '#94A3B8' },
  scammerBold: { fontWeight: '800', color: '#F87171' },

  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 14 },
  shareText: { fontSize: 13, color: colors.textTertiary, fontWeight: '500' },

  footer: { paddingHorizontal: spacing.lg, paddingBottom: 24, paddingTop: 8 },
  nextBtn: { backgroundColor: colors.surface, paddingVertical: 18, borderRadius: radius.lg, alignItems: 'center', borderWidth: 1.5 },
  nextText: { fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
});