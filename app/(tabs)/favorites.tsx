import { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { QuoteListItem } from '@/components/quotes/QuoteListItem';
import { FontUi } from '@/constants/fonts';
import { useAppTheme } from '@/context/app-theme';
import { useQuotesCatalog } from '@/context/QuotesCatalogContext';
import { getQuoteById } from '@/lib/quote-helpers';
import { useSukhanStore } from '@/store/sukhan-store';

export default function FavoritesScreen() {
  const t = useAppTheme();
  const { quotes: catalog } = useQuotesCatalog();
  const favoriteIds = useSukhanStore((s) => s.favoriteIds);

  const quotes = useMemo(
    () =>
      favoriteIds
        .map((id) => getQuoteById(catalog, id))
        .filter((q): q is NonNullable<typeof q> => q != null),
    [favoriteIds, catalog],
  );

  return (
    <View style={[styles.flex, { backgroundColor: t.background }]}>
      <AppHeader title="Favorites" subtitle="Saved for quick copy & status" />
      {quotes.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={[styles.emptyTitle, { color: t.text, fontFamily: FontUi.semibold }]}>
            No favorites yet
          </Text>
          <Text style={[styles.emptySub, { color: t.textMuted, fontFamily: FontUi.regular }]}>
            Tap the heart on any quote to keep it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={quotes}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <QuoteListItem quote={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
