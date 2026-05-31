// screens/LearningScreen.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, BookOpen, AlertTriangle, Eye, Award } from 'lucide-react-native';
import { colors, radius, shadow, spacing } from '../theme';

export default function LearningScreen({ navigation }) {
  const [activeCourseId, setActiveCourseId] = useState(1); // 預設開啟第一堂課

  const courses = [
    { id: 1, title: '假訊息特徵與防禦', subtitle: '核心手法特徵', icon: AlertTriangle, color: '#EF4444', content: '不實訊息最常利用「製造恐慌」、「惡意地域標籤」或「偽造官方權威」來動搖理智。例如宣稱電費明天起暴漲三倍、或特定食材有致命毒素。看到附帶「不立刻轉傳就會面臨重大損失、積功德」等催促文字，就必須提高警覺、主動查核來源事實！' },
    { id: 2, title: 'AI 換臉與影像科學', subtitle: '深偽技術解密', icon: Eye, color: '#3B82F6', content: '隨著生成式 AI 演算法普及，即時換臉（Real-time Deepfake）已成為新型干擾工具。辨識關鍵在於「物理破綻」：觀察影片中人物在轉頭 90 度、或手部在臉前大幅度揮動時，嘴唇與面部邊緣是否出現像素模糊、閃爍或延遲的重疊數位痕跡。' },
    { id: 3, title: '科學偏方與資訊事實', subtitle: '偽科學漏洞破除', icon: BookOpen, color: '#10B981', content: '健康養生偏方往往擅長利用大眾「關心健康」的心理軟肋，移花接木冠上美國 FDA、知名台大醫師或「我當醫生的同學」之名來製造日常食安焦慮。遇到這類訊息，切勿盲目跟風嘗試，應自行至衛福部食藥署闢謠專區或查核中心進行交叉求證。' },
    { id: 4, title: '國際事實查核素養', subtitle: '資訊免疫力養成', icon: Award, color: '#F59E0B', content: '面對真假消息混雜的網路社群環境，提升媒體識讀能力是治本之道。查核核心金律為「不盲目轉傳、主動交叉比對官方正式新聞通稿、注意歷史訊息發布時間是否被刻意乾坤大挪移」。利用別人的不實受騙數據，為自己建立數位免疫抗體！' }
  ];

  const currentCourse = courses.find(c => c.id === activeCourseId);

  return (
    <SafeAreaView style={styles.container}>
      {/* 頂部導覽列 */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.iconBtn}>
          <ChevronLeft color={colors.textSecondary} size={24} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>媒體識讀自主講堂</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* 🔑 兩排兩列 (2x2) 矩陣網格 */}
        <View style={styles.gridContainer}>
          {courses.map((course) => {
            const IconComponent = course.icon;
            const isActive = course.id === activeCourseId;
            
            return (
              <TouchableOpacity
                key={course.id}
                style={[
                  styles.squareCard,
                  isActive ? { borderColor: course.color, backgroundColor: `${course.color}05` } : { borderColor: colors.border }
                ]}
                onPress={() => setActiveCourseId(course.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconWrapper, { backgroundColor: isActive ? `${course.color}20` : `${course.color}10` }]}>
                  <IconComponent color={course.color} size={18} strokeWidth={2.2} />
                </View>
                <View style={styles.cardTextContent}>
                  <Text style={[styles.cardTitle, isActive && { color: course.color, fontWeight: '800' }]}>
                    {course.title}
                  </Text>
                  <Text style={styles.cardSubtitle}>{course.subtitle}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 📚 下方同頁面動態切換之課程內文看板 */}
        {currentCourse && (
          <View style={[styles.detailSection, { borderColor: currentCourse.color }]}>
            <View style={styles.detailHeader}>
              <View style={[styles.detailDot, { backgroundColor: currentCourse.color }]} />
              <Text style={[styles.detailHeaderTitle, { color: currentCourse.color }]}>
                當前核心章節：{currentCourse.title}
              </Text>
            </View>
            <Text style={styles.detailBodyText}>{currentCourse.content}</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 10, paddingBottom: 16, alignItems: 'center' },
  iconBtn: { width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  topBarTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: 40 },
  
  // 🔑 完美適配兩排兩列 (2x2) 百分比排版，完全防爆版
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12, marginBottom: 20, marginTop: 8, width: '100%' },
  squareCard: { width: '48.5%', height: 130, backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1.5, padding: 12, justifyContent: 'space-between', ...shadow.sm },
  iconWrapper: { width: 34, height: 34, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center' },
  cardTextContent: { gap: 2 },
  cardTitle: { fontSize: 12, fontWeight: '700', color: colors.textPrimary, lineHeight: 16 },
  cardSubtitle: { fontSize: 10, color: colors.textTertiary, fontWeight: '500' },
  
  detailSection: { backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1.5, padding: 18, ...shadow.sm },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  detailDot: { width: 6, height: 6, borderRadius: 3 },
  detailHeaderTitle: { fontSize: 14, fontWeight: '800' },
  detailBodyText: { fontSize: 13, color: colors.textSecondary, lineHeight: 24, fontWeight: '500' }
});