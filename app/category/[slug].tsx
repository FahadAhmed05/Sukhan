import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { QuoteListItem } from '@/components/quotes/QuoteListItem';
import { SLUG_TO_CATEGORY } from '@/constants/categories';
import { FontUi } from '@/constants/fonts';
import { useAppTheme } from '@/context/app-theme';
import { useQuotesCatalog } from '@/context/QuotesCatalogContext';
import { getQuotesByCategory } from '@/lib/quote-helpers';
import { useSukhanStore } from '@/store/sukhan-store';

export default function CategoryQuotesScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const t = useAppTheme();
  const { quotes: allQuotes } = useQuotesCatalog();
  const recordCategoryOpen = useSukhanStore((s) => s.recordCategoryOpen);

  const category = slug && SLUG_TO_CATEGORY[slug] ? SLUG_TO_CATEGORY[slug] : undefined;

  const quotes = useMemo(
    () => (category ? getQuotesByCategory(allQuotes, category) : []),
    [category, allQuotes],
  );

  useFocusEffect(
    useCallback(() => {
      if (category) recordCategoryOpen(category);
    }, [category, recordCategoryOpen]),
  );

  if (!category) {
    return (
      <View style={[styles.flex, { backgroundColor: t.background }]}>
        <AppHeader title="Category" showBack />
        <View style={styles.emptyWrap}>
          <Text style={[styles.emptyTitle, { color: t.text, fontFamily: FontUi.semibold }]}>
            Category not found
          </Text>
          <Text style={[styles.emptySub, { color: t.textMuted, fontFamily: FontUi.regular }]}>
            Go back and pick a topic from Home.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: t.background }]}>
      <AppHeader title={category} subtitle={`${quotes.length} quotes`} showBack />
      <FlatList
        data={quotes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <QuoteListItem quote={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { padding: 16, paddingBottom: 32 },
  emptyWrap: { flex: 1, padding: 24, justifyContent: 'center' },
  emptyTitle: { fontSize: 18, textAlign: 'center' },
  emptySub: { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
});
