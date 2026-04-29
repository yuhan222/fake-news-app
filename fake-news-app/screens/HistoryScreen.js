import { BarChart2, ChevronLeft, RotateCcw, ShieldCheck, Target } from 'lucide-react-native';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQuizContext } from '../QuizContext';
import { colors, radius, shadow, spacing } from '../theme';

export default function HistoryScreen({ navigation }) {
  const { history, getTopWeaknesses, resetHistory } = useQuizContext();

  const accuracy = history.totalQuestions === 0
    ? 0
    : Math.round((history.correctAnswers / history.totalQuestions) * 100);
  const wrongAnswers = history.totalQuestions - history.correctAnswers;
  const weakTypes = getTopWeaknesses();

  const badgeConfig = accuracy >= 80
    ? { label: '識破大師', color: colors.success, border: colors.successBorder, bg: colors.successBg }
    : accuracy >= 50
    ? { label: '熟練偵探', color: colors.primaryLight, border: colors.primaryBorder, bg: colors.primaryBg }
    : { label: '新手上路', color: colors.warning, border: colors.warningBorder, bg: colors.warningBg };

  const progressColor = accuracy >= 80 ? colors.success : accuracy >= 50 ? colors.primary : colors.danger;
  const progressShadowColor = accuracy >= 80 ? '#10B981' : accuracy >= 50 ? '#3B82F6' : '#EF4444';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topGlow} />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.iconBtn}>
          <ChevronLeft color={colors.textSecondary} size={24} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>學習數據中心</Text>
        <TouchableOpacity onPress={resetHistory} style={styles.iconBtn}>
          <RotateCcw color={colors.textTertiary} size={16} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* 等級卡 */}
        <View style={[styles.badgeCard, { borderColor: badgeConfig.border, backgroundColor: badgeConfig.bg }]}>
          <View style={styles.cardTopLine} />
          <ShieldCheck color={badgeConfig.color} size={22} />
          <View>
            <Text style={styles.badgeLabel}>目前防詐等級</Text>
            <Text style={[styles.badgeTitle, { color: badgeConfig.color }]}>{badgeConfig.label}</Text>
          </View>
        </View>

        {/* 三欄統計 */}
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

        {/* 正確率 */}
        <View style={styles.section}>
          <View style={styles.cardTopLine} />
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>綜合正確率</Text>
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
            {accuracy === 0 ? '還沒有答題紀錄，快去挑戰！'
              : accuracy >= 80 ? '非常優秀，你已是防詐達人！'
              : accuracy >= 50 ? '還不錯，繼續練習提升正確率！'
              : '加油！建議先去學習模式補強'}
          </Text>
        </View>

        {/* 弱點 */}
        <View style={styles.section}>
          <View style={styles.cardTopLine} />
          <Text style={styles.sectionTitle}>需加強的類型</Text>
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
              <Text style={styles.emptyText}>目前還沒有錯題，太厲害了！🎉</Text>
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
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: 16, gap: spacing.sm },

  cardTopLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: colors.borderMid },

  badgeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 18, borderRadius: radius.lg, borderWidth: 1,
    overflow: 'hidden', ...shadow.sm,
  },
  badgeLabel: { fontSize: 11, color: colors.textTertiary, fontWeight: '600', marginBottom: 2 },
  badgeTitle: { fontSize: 20, fontWeight: '800' },

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

  footer: { paddingHorizontal: spacing.lg, paddingBottom: 24, paddingTop: 8 },
  retryBtn: {
    backgroundColor: colors.surface, paddingVertical: 18,
    borderRadius: radius.lg, alignItems: 'center',
    borderWidth: 1, borderColor: colors.primaryBorder,
    ...shadow.primary,
  },
  retryBtnText: { color: colors.primaryLight, fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
});
