import { AlertTriangle, BookOpen, ChevronLeft, ChevronRight, Share2 } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Animated, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme';

const { width } = Dimensions.get('window');

const tutorialData = [
  {
    id: 1,
    Icon: AlertTriangle,
    iconColor: colors.danger,
    iconBg: 'rgba(239,68,68,0.1)',
    iconBorder: 'rgba(239,68,68,0.2)',
    tag: '技巧 01',
    tagColor: colors.danger,
    tagBg: 'rgba(239,68,68,0.1)',
    tagBorder: 'rgba(239,68,68,0.2)',
    title: '注意強烈情緒字眼',
    description: '假訊息常使用「震驚！」、「緊急通知」、「太可怕了」等誇張字眼，試圖引發你的恐慌或憤怒，讓你失去理智判斷的能力。',
  },
  {
    id: 2,
    Icon: BookOpen,
    iconColor: colors.warning,
    iconBg: 'rgba(245,158,11,0.1)',
    iconBorder: 'rgba(245,158,11,0.2)',
    tag: '技巧 02',
    tagColor: colors.warning,
    tagBg: 'rgba(245,158,11,0.1)',
    tagBorder: 'rgba(245,158,11,0.2)',
    title: '查證資訊來源',
    description: '小心「聽說」、「專家指出」卻沒有明確人名或機構的來源。真正的權威機構會留下可查證的官方網站連結。',
  },
  {
    id: 3,
    Icon: Share2,
    iconColor: colors.success,
    iconBg: 'rgba(16,185,129,0.1)',
    iconBorder: 'rgba(16,185,129,0.2)',
    tag: '技巧 03',
    tagColor: colors.success,
    tagBg: 'rgba(16,185,129,0.1)',
    tagBorder: 'rgba(16,185,129,0.2)',
    title: '要求轉傳要警覺',
    description: '「不傳會後悔」、「趕快發到所有群組」，這是假訊息病毒式傳播的標準特徵。在按下分享前，請先暫停三秒鐘思考！',
  },
];

export default function LearningScreen({ navigation }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const btnScale = useRef(new Animated.Value(1)).current;

  const handleScroll = (e) => {
    setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const isLast = currentIndex === tutorialData.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topGlow} />

      {/* 頂部 */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ChevronLeft color={colors.textSecondary} size={24} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>防詐基礎課程</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* 膠囊進度點 */}
      <View style={styles.dotsRow}>
        {tutorialData.map((_, i) => {
          const w = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [6, 22, 6], extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.25, 1, 0.25], extrapolate: 'clamp',
          });
          const bg = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [colors.border, colors.primary, colors.border], extrapolate: 'clamp',
          });
          return <Animated.View key={i} style={[styles.dot, { width: w, opacity, backgroundColor: bg }]} />;
        })}
      </View>

      {/* 卡片輪播 */}
      <Animated.ScrollView
        horizontal pagingEnabled showsHorizontalScrollIndicator={false} bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {tutorialData.map((item) => {
          const { Icon, iconColor, iconBg, iconBorder, tag, tagColor, tagBg, tagBorder, title, description } = item;
          return (
            <View key={item.id} style={styles.slide}>
              <View style={styles.card}>
                <View style={styles.cardTopLine} />

                {/* Tag */}
                <View style={[styles.tagBadge, { backgroundColor: tagBg, borderColor: tagBorder }]}>
                  <Text style={[styles.tagText, { color: tagColor }]}>{tag}</Text>
                </View>

                {/* 圖示 */}
                <View style={[styles.iconWrap, { backgroundColor: iconBg, borderColor: iconBorder }]}>
                  <Icon color={iconColor} size={42} strokeWidth={1.5} />
                </View>

                {/* 標題 */}
                <Text style={styles.cardTitle}>{title}</Text>
                <View style={[styles.divider, { backgroundColor: iconColor }]} />
                <Text style={styles.cardDesc}>{description}</Text>

                {/* 滑動提示 */}
                {!isLast && (
                  <View style={styles.swipeHint}>
                    <Text style={styles.swipeText}>向左滑動</Text>
                    <ChevronRight size={13} color={colors.textTertiary} />
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>

      {/* 底部 */}
      <View style={styles.footer}>
        {isLast ? (
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => navigation.navigate('Quiz')}
              onPressIn={() => Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true }).start()}
              onPressOut={() => Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
              activeOpacity={1}
            >
              <Text style={styles.startBtnText}>我準備好了，開始挑戰！</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View style={{ height: 56 }} />
        )}
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
    paddingHorizontal: spacing.lg, paddingTop: 10, paddingBottom: 12, alignItems: 'center',
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: radius.sm,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  topBarTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },

  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 16 },
  dot: { height: 6, borderRadius: 3 },

  slide: { width, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.lg },
  card: {
    backgroundColor: colors.surface, width: '100%',
    borderRadius: radius.xl, padding: spacing.xl,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.md,
  },
  cardTopLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: colors.borderMid },

  tagBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: radius.full, borderWidth: 1, marginBottom: spacing.lg,
  },
  tagText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },

  iconWrap: {
    width: 84, height: 84, borderRadius: radius.lg,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: spacing.lg, borderWidth: 1,
  },

  cardTitle: { fontSize: 22, fontWeight: '900', color: colors.textPrimary, marginBottom: spacing.md, lineHeight: 30 },
  divider: { width: 36, height: 3, borderRadius: 2, marginBottom: spacing.md },
  cardDesc: { fontSize: 15, lineHeight: 26, color: colors.textSecondary },

  swipeHint: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: spacing.lg, alignSelf: 'flex-end' },
  swipeText: { fontSize: 11, color: colors.textTertiary, fontWeight: '500' },

  footer: { paddingHorizontal: spacing.lg, paddingBottom: 28, paddingTop: 12 },
  startBtn: {
    backgroundColor: colors.primaryDark, paddingVertical: 18,
    borderRadius: radius.lg, alignItems: 'center',
    borderWidth: 1, borderColor: colors.primaryBorder,
    ...shadow.primary,
  },
  startBtnText: { color: 'white', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
});
