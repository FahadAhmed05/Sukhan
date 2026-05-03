import { Text, View, StyleSheet } from 'react-native';

import { FontUi } from '@/constants/fonts';
import { useAppTheme } from '@/context/app-theme';
import { useSukhanStore } from '@/store/sukhan-store';

export function StreakBanner() {
  const streak = useSukhanStore((s) => s.currentStreak);
  const best = useSukhanStore((s) => s.bestStreak);
  const t = useAppTheme();

  const sub =
    streak < 1
      ? 'Open Sukhan daily to build a streak — small habits stick.'
      : `Best record: ${best} days · Keep the rhythm going.`;

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: t.card, borderColor: t.border, shadowColor: t.shadow },
      ]}>
      <Text style={styles.emoji} accessibilityLabel="Streak">
        🔥
      </Text>
      <View style={styles.textCol}>
        <Text style={[styles.title, { color: t.text, fontFamily: FontUi.bold }]}>
          {streak} day streak
        </Text>
        <Text style={[styles.sub, { color: t.textMuted, fontFamily: FontUi.regular }]}>{sub}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    gap: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  emoji: { fontSize: 28 },
  textCol: { flex: 1 },
  title: { fontSize: 16 },
  sub: { fontSize: 13, marginTop: 4, lineHeight: 18 },
});
