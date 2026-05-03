import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenBody } from '@/components/layout/ScreenBody';
import { CategoryTile } from '@/components/home/CategoryTile';
import { QuoteOfDayCard } from '@/components/home/QuoteOfDayCard';
import { StreakBanner } from '@/components/home/StreakBanner';
import { CATEGORY_ORDER, CATEGORY_SLUGS } from '@/constants/categories';
import { FontUi } from '@/constants/fonts';
import { useAppTheme } from '@/context/app-theme';
import { useQuotesCatalog } from '@/context/QuotesCatalogContext';
import { getQuoteOfTheDay } from '@/lib/quote-helpers';

export default function HomeScreen() {
  const router = useRouter();
  const t = useAppTheme();
  const { quotes, loading, error, source, refresh } = useQuotesCatalog();

  const quoteOfDay = useMemo(() => getQuoteOfTheDay(quotes), [quotes]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of CATEGORY_ORDER) map[c] = 0;
    for (const q of quotes) {
      map[q.category] += 1;
    }
    return map;
  }, [quotes]);

  const showLoading = loading && quotes.length === 0;

  return (
    <View style={[styles.flex, { backgroundColor: t.background }]}>
      <AppHeader
        title="Sukhan"
        subtitle="Urdu quotes · streaks · insights"
        right={
          <TouchableOpacity
            onPress={() => router.push('/search')}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Search quotes">
            <Ionicons name="search" size={24} color={t.headerText} />
          </TouchableOpacity>
        }
      />
      <ScreenBody refreshing={loading} onRefresh={() => void refresh()}>
        {error && source === 'bundled' ? (
          <Text style={[styles.offline, { color: t.textMuted, fontFamily: FontUi.regular }]}>
            Could not reach Firebase — showing bundled quotes. Pull down to retry.
          </Text>
        ) : null}
        {showLoading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={t.tint} />
          </View>
        ) : null}
        <StreakBanner />
        {quoteOfDay ? <QuoteOfDayCard quote={quoteOfDay} /> : null}
        <Text style={[styles.section, { color: t.text, fontFamily: FontUi.bold }]}>
          Browse by category
        </Text>
        <View style={styles.grid}>
          {CATEGORY_ORDER.map((cat) => (
            <CategoryTile
              key={cat}
              category={cat}
              count={counts[cat] ?? 0}
              onPress={() => router.push(`/category/${CATEGORY_SLUGS[cat]}`)}
            />
          ))}
        </View>
      </ScreenBody>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  offline: { fontSize: 13, marginBottom: 12, lineHeight: 18 },
  loaderWrap: { paddingVertical: 24, alignItems: 'center' },
  section: { fontSize: 18, marginBottom: 12 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
