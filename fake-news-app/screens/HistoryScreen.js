// screens/HistoryScreen.js
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { BarChart2, ChevronLeft, RotateCcw, ShieldCheck, Target, Calendar } from 'lucide-react-native';
import { useQuizContext } from '../QuizContext'; // 引入全域狀態大腦
import { colors, radius, shadow, spacing } from '../theme';

export default function HistoryScreen({ navigation }) {
  // --- 1. 從全域狀態大腦中取得真實的學習數據與遊戲化進度 ---
  const { history, xp, level, isLoading, getTopWeaknesses, resetHistory } = useQuizContext();

  // 處理非同步資料載入時的緩衝畫面
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textSecondary, marginTop: 10 }}>安全加載數據中...</Text>
      </SafeAreaView>
    );
  }

  // --- 2. 核心統計數據計算 ---
  const accuracy = history.totalQuestions === 0
    ? 0
    : Math.round((history.correctAnswers / history.totalQuestions) * 100);
  const wrongAnswers = history.totalQuestions - history.correctAnswers;
  const weakTypes = getTopWeaknesses();

  // --- 3. 動態適配真正的遊戲化段位視覺 ---
  const getBadgeConfig = () => {
    switch (level) {
      case '事實查核專家':
        return { color: colors.amber || '#F4A261', border: 'rgba(244,162,97,0.4)', bg: 'rgba(244,162,97,0.06)' };
      case '新手偵探':
        return { color: colors.primaryLight, border: colors.primaryBorder, bg: colors.primaryBg };
      case '網路小白':
      default:
        return { color: colors.textTertiary, border: colors.border, bg: colors.surface };
    }
  };

  const badgeStyle = getBadgeConfig();
  const progressColor = accuracy >= 80 ? colors.success : accuracy >= 50 ? colors.primary : colors.danger;
  const progressShadowColor = accuracy >= 80 ? '#10B981' : accuracy >= 50 ? '#3B82F6' : '#EF4444';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topGlow} />

      {/* 頂部導覽列 */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.iconBtn}>
          <ChevronLeft color={colors.textSecondary} size={24} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>學習數據與養成中心</Text>
        <TouchableOpacity onPress={resetHistory} style={styles.iconBtn}>
          <RotateCcw color={colors.danger} size={16} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* 🏆 榮譽段位養成卡片 (對接真正的 AsyncStorage 全域等級與 XP) */}
        <View style={[styles.badgeCard, { borderColor: badgeStyle.border, backgroundColor: badgeStyle.bg }]}>
          <View style={styles.cardTopLine} />
          <ShieldCheck color={badgeStyle.color} size={26} />
          {/* 🔑 核心修正：將原本卡死編譯的 <div> 標籤替換為 React Native 的 <View> */}
          <View style={{ flex: 1 }}>
            <Text style={styles.badgeLabel}>目前反假訊息段位</Text>
            <Text style={[styles.badgeTitle, { color: badgeStyle.color }]}>{level}</Text>
          </View>
          <View style={styles.xpBadge}>
            <Text style={styles.xpBadgeText}>{xp} XP</Text>
          </View>
        </View>

        {/* 三欄數值累計統計看板 */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <BarChart2 color={colors.textTertiary} size={17} />
            <Text style={styles.statNum}>{history.totalQuestions}</Text>
            <Text style={styles.statLabel}>總答題數</Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.successBorder, backgroundColor: colors.successBg }]}>
            <Target color={colors.success} size={17} />
            <Text style={[styles.statNum, { color: colors.success }]}>{history.correctAnswers}</Text>
            <Text style={styles.statLabel}>答對題數</Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.dangerBorder, backgroundColor: colors.dangerBg }]}>
            <Target color={colors.danger} size={17} />
            <Text style={[styles.statNum, { color: colors.danger }]}>{wrongAnswers}</Text>
            <Text style={styles.statLabel}>答錯題數</Text>
          </View>
        </View>

        {/* 綜合正確率進度條 */}
        <View style={styles.section}>
          <View style={styles.cardTopLine} />
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>綜合查核正確率</Text>
            <Text style={[styles.percentageText, { color: progressColor }]}>{accuracy}%</Text>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.barFill, {
              width: `${accuracy}%`,
              backgroundColor: progressColor,
              shadowColor: progressShadowColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 6,
            }]} />
          </View>
          <Text style={styles.barHint}>
            {history.totalQuestions === 0 ? '還沒有答題紀錄，快去挑戰！'
              : accuracy >= 80 ? '非常優秀！您的查核視角已具備專家免疫力！'
              : accuracy >= 50 ? '表現不錯，繼續練習來突破弱點盲區！'
              : '加油！建議先前往「學習模式」圈選特徵補強。'}
          </Text>
        </View>

        {/* 🔴 智慧弱點評估 */}
        <View style={styles.section}>
          <View style={styles.cardTopLine} />
          <Text style={styles.sectionTitle}>🔴 智慧建議加強類型</Text>
          <View style={{ marginTop: 12, gap: 8 }}>
            {weakTypes.length > 0 ? weakTypes.map((type, idx) => (
              <View key={type} style={styles.weakItem}>
                <View style={[styles.weakRank, {
                  backgroundColor: idx === 0 ? colors.dangerBg : colors.surface,
                  borderColor: idx === 0 ? colors.dangerBorder : colors.border,
                }]}>
                  <Text style={[styles.weakRankText, { color: idx === 0 ? colors.danger : colors.textTertiary }]}>{idx + 1}</Text>
                </View>
                <Text style={styles.weakLabel}>{type}</Text>
              </View>
            )) : (
              <Text style={styles.emptyText}>目前還沒有任何錯題，您的防護力完美！🎉</Text>
            )}
          </View>
        </View>

        {/* 📝 歷次挑戰足跡紀錄清單 */}
        <View style={styles.section}>
          <View style={styles.cardTopLine} />
          <Text style={styles.sectionTitle}>挑戰歷史足跡 (手機本地備份)</Text>
          <View style={{ marginTop: 12 }}>
            {history.records && history.records.length > 0 ? (
              history.records.map((item, index) => (
                <View key={index} style={styles.recordRow}>
                  <View style={styles.recordLeft}>
                    <Calendar size={13} color={colors.textTertiary} />
                    <Text style={styles.recordDate}>{item.date}</Text>
                    <Text style={styles.recordScore}>答對 {item.score}/{item.total} 題</Text>
                  </View>
                  <View style={styles.recordRight}>
                    <Text style={styles.recordAccuracy}>{item.accuracy}%</Text>
                    <View style={styles.xpMiniBadge}>
                      <Text style={styles.xpMiniText}>+{item.xpGained} XP</Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>尚無單輪挑戰模式的歷史紀錄存檔。</Text>
            )}
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.retryBtn} onPress={() => navigation.navigate('Home')} activeOpacity={0.85}>
          <Text style={styles.retryBtnText}>返回首頁</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topGlow: {
    position: 'absolute', top: -60, left: '50%', marginLeft: -120,
    width: 240, height: 240, borderRadius: 120,
    backgroundColor: 'rgba(37,99,235,0.07)',
  },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: 10, paddingBottom: 16, alignItems: 'center',
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: radius.sm,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  topBarTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: 100, gap: spacing.sm },

  cardTopLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: colors.borderMid },

  badgeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 18, borderRadius: radius.lg, borderWidth: 1,
    overflow: 'hidden', ...shadow.sm,
  },
  badgeLabel: { fontSize: 11, color: colors.textTertiary, fontWeight: '600', marginBottom: 2 },
  badgeTitle: { fontSize: 19, fontWeight: '800' },
  // 🔑 核心修正：將原本非法的 bg 縮寫屬性修正為 React Native 標準的 backgroundColor
  xpBadge: { backgroundColor: 'rgba(0,180,216,0.12)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.md, borderWidth: 1, borderColor: colors.primaryBorder },
  xpBadgeText: { color: colors.primaryLight, fontWeight: 'bold', fontSize: 14 },

  statsGrid: { flexDirection: 'row', gap: 8 },
  statCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: 14, alignItems: 'center', gap: 5,
    borderWidth: 1, borderColor: colors.border,
    ...shadow.sm,
  },
  statNum: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  statLabel: { fontSize: 10, color: colors.textTertiary, fontWeight: '600' },

  section: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.lg, borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden', ...shadow.sm,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  percentageText: { fontSize: 28, fontWeight: '900', lineHeight: 30 },

  barBg: { height: 6, backgroundColor: colors.border, borderRadius: radius.full, marginBottom: 10, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: radius.full },
  barHint: { fontSize: 12, color: colors.textTertiary, fontWeight: '500' },

  weakItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9, borderBottomWidth: 1, borderColor: colors.border },
  weakRank: { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  weakRankText: { fontSize: 11, fontWeight: '700' },
  weakLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '500', flex: 1 },
  emptyText: { fontSize: 13, color: colors.textTertiary, fontWeight: '500', paddingVertical: 8 },

  recordRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: colors.border },
  recordLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  recordDate: { fontSize: 11, color: colors.textTertiary, marginRight: 8 },
  recordScore: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  recordRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  recordAccuracy: { fontSize: 15, fontWeight: 'bold', color: colors.success },
  xpMiniBadge: { backgroundColor: 'rgba(0,180,216,0.08)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.sm },
  xpMiniText: { color: colors.primaryLight, fontSize: 10, fontWeight: 'bold' },

  footer: { paddingHorizontal: spacing.lg, paddingBottom: 24, paddingTop: 8 },
  retryBtn: {
    backgroundColor: colors.surface, paddingVertical: 18,
    borderRadius: radius.lg, alignItems: 'center',
    borderWidth: 1, borderColor: colors.primaryBorder,
    ...shadow.primary,
  },
  retryBtnText: { color: colors.primaryLight, fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
});