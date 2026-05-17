import { AlertTriangle, BookOpen, ChevronLeft, ChevronRight, Film, Globe, Link, Search, Share2, Shield } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Animated, Dimensions, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme';

const { width } = Dimensions.get('window');

// 查核機構資料（技巧 07 用）
const factCheckSites = [
  { name: '台灣事實查核中心', url: 'https://tfc-taiwan.org.tw', desc: '台灣最大獨立查核機構' },
  { name: 'MyGoPen 謠言偵測', url: 'https://www.mygopen.com', desc: '專攻 LINE 群組謠言' },
  { name: '蘭姆酒吐司', url: 'https://www.rumtoast.com', desc: '深度破解網路謠言' },
];

const tutorialData = [
  // ── 原有三張 ──────────────────────────────────────────
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

  // ── 新增四張 ──────────────────────────────────────────
  {
    id: 4,
    Icon: Film,
    iconColor: '#A78BFA', // 紫色系，代表 AI／科技感
    iconBg: 'rgba(167,139,250,0.1)',
    iconBorder: 'rgba(167,139,250,0.2)',
    tag: '技巧 04',
    tagColor: '#A78BFA',
    tagBg: 'rgba(167,139,250,0.1)',
    tagBorder: 'rgba(167,139,250,0.2)',
    title: 'Deepfake 影片辨識',
    description: 'AI 換臉影片越來越逼真，但仍有破綻可循：\n\n• 嘴唇邊緣：說話時輪廓模糊或有「閃爍」感\n• 眨眼頻率：過快、過慢，或根本不眨眼\n• 耳朵與髮際線：邊緣容易出現不自然的像素紋路\n• 情緒與聲音：嘴型與語音對不上，表情顯得僵硬\n\n看到名人說出不尋常言論，先停下來，用原始影片比對。',
  },
  {
    id: 5,
    Icon: Search,
    iconColor: '#38BDF8', // 天藍色，代表搜尋
    iconBg: 'rgba(56,189,248,0.1)',
    iconBorder: 'rgba(56,189,248,0.2)',
    tag: '技巧 05',
    tagColor: '#38BDF8',
    tagBg: 'rgba(56,189,248,0.1)',
    tagBorder: 'rgba(56,189,248,0.2)',
    title: '圖片反搜教學',
    description: '假訊息常盜用舊圖片假裝是新聞現場。你可以用「以圖搜圖」揪出真相：\n\n① 手機長按圖片 → 選「搜尋此圖片」\n② 電腦前往 images.google.com → 點相機圖示 → 上傳圖片\n③ 查看搜尋結果中圖片的原始出處與拍攝時間\n\n若圖片最早出現的日期遠早於新聞，幾乎可確定是移花接木。',
  },
  {
    id: 6,
    Icon: Link,
    iconColor: '#FB923C', // 橙色，代表警示
    iconBg: 'rgba(251,146,60,0.1)',
    iconBorder: 'rgba(251,146,60,0.2)',
    tag: '技巧 06',
    tagColor: '#FB923C',
    tagBg: 'rgba(251,146,60,0.1)',
    tagBorder: 'rgba(251,146,60,0.2)',
    title: '辨識假冒網域',
    description: '詐騙網站會把網址做得跟官方幾乎一模一樣，差一個字母就中招：\n\n• 官方：taiwan.gov.tw\n  假冒：talwan.gov.tw（l 換成了 1）\n\n• 官方：shopee.tw\n  假冒：sh0pee.tw（o 換成了 0）\n\n收到連結先別點，用手指長按預覽完整網址，重點看「最後一個點之前的字」才是真正的網域名稱。',
  },
  {
    id: 7,
    Icon: Shield,
    iconColor: '#34D399', // 綠色，代表可靠／安全
    iconBg: 'rgba(52,211,153,0.1)',
    iconBorder: 'rgba(52,211,153,0.2)',
    tag: '技巧 07',
    tagColor: '#34D399',
    tagBg: 'rgba(52,211,153,0.1)',
    tagBorder: 'rgba(52,211,153,0.2)',
    title: '善用查核機構資源',
    description: '台灣有多個專業的事實查核組織，遇到可疑訊息，30 秒就能查清楚：',
    // 額外欄位，由卡片渲染邏輯判斷是否顯示
    factCheckLinks: factCheckSites,
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

      {/* 進度文字 + 膠囊進度點 */}
      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>{currentIndex + 1} / {tutorialData.length}</Text>
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
          const { Icon, iconColor, iconBg, iconBorder, tag, tagColor, tagBg, tagBorder, title, description, factCheckLinks } = item;
          return (
            <View key={item.id} style={styles.slide}>
              {/* 卡片內容可捲動（部分卡片文字較長） */}
              <ScrollView
                style={styles.card}
                contentContainerStyle={styles.cardContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <View style={styles.cardTopLine} />

                {/* 技巧標籤 */}
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

                {/* 說明文字 */}
                <Text style={styles.cardDesc}>{description}</Text>

                {/* 技巧 07 專用：查核機構連結列表 */}
                {factCheckLinks && (
                  <View style={styles.linkList}>
                    {factCheckLinks.map((site) => (
                      <TouchableOpacity
                        key={site.url}
                        style={styles.linkItem}
                        onPress={() => Linking.openURL(site.url)}
                        activeOpacity={0.75}
                      >
                        <Globe size={14} color={colors.primaryLight} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.linkName}>{site.name}</Text>
                          <Text style={styles.linkDesc}>{site.desc}</Text>
                        </View>
                        <ChevronRight size={13} color={colors.primaryBorder} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* 滑動提示（最後一張不顯示） */}
                {!isLast && (
                  <View style={styles.swipeHint}>
                    <Text style={styles.swipeText}>向左滑動</Text>
                    <ChevronRight size={13} color={colors.textTertiary} />
                  </View>
                )}
              </ScrollView>
            </View>
          );
        })}
      </Animated.ScrollView>

      {/* 底部按鈕 */}
      <View style={styles.footer}>
        {isLast ? (
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.homeBtn}
              onPress={() => navigation.navigate('Home')}
              activeOpacity={0.8}
            >
              <Text style={styles.homeBtnText}>回首頁</Text>
            </TouchableOpacity>

            <Animated.View style={[{ flex: 1 }, { transform: [{ scale: btnScale }] }]}>
              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => navigation.navigate('Quiz')}
                onPressIn={() => Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true }).start()}
                onPressOut={() => Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
                activeOpacity={1}
              >
                <Text style={styles.startBtnText}>開始挑戰！</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
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

  // 進度列（數字 + 膠囊點）
  progressRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginBottom: 14,
  },
  progressLabel: { fontSize: 11, fontWeight: '700', color: colors.textTertiary, minWidth: 32, textAlign: 'right' },
  dotsRow: { flexDirection: 'row', gap: 6 },
  dot: { height: 6, borderRadius: 3 },

  // 卡片（改為 ScrollView 以支援較長內容）
  slide: { width, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.lg },
  card: {
    backgroundColor: colors.surface, width: '100%',
    borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.border,
    maxHeight: '100%',
    ...shadow.md,
  },
  cardContent: {
    padding: spacing.xl,
    overflow: 'hidden',
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
  cardDesc: { fontSize: 14, lineHeight: 24, color: colors.textSecondary },

  // 查核機構連結列表（技巧 07）
  linkList: { marginTop: spacing.md, gap: 8 },
  linkItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.primaryBg,
    borderWidth: 1, borderColor: colors.primaryBorder,
    borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12,
  },
  linkName: { fontSize: 13, fontWeight: '700', color: colors.primaryLight, marginBottom: 1 },
  linkDesc: { fontSize: 11, color: colors.textTertiary, fontWeight: '500' },

  swipeHint: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: spacing.lg, alignSelf: 'flex-end' },
  swipeText: { fontSize: 11, color: colors.textTertiary, fontWeight: '500' },

  footer: { paddingHorizontal: spacing.lg, paddingBottom: 28, paddingTop: 12 },
  btnRow: { flexDirection: 'row', gap: 10, alignItems: 'stretch' },
  homeBtn: {
    flex: 1, backgroundColor: colors.surface, paddingVertical: 18,
    borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
    ...shadow.sm,
  },
  homeBtnText: { color: colors.textSecondary, fontSize: 15, fontWeight: '700' },
  startBtn: {
    flex: 1, backgroundColor: colors.primaryDark, paddingVertical: 18,
    borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.primaryBorder,
    ...shadow.primary,
  },
  startBtnText: { color: 'white', fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },
});