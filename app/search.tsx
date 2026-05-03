import { useMemo, useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text } from 'react-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { QuoteListItem } from '@/components/quotes/QuoteListItem';
import { FontUi } from '@/constants/fonts';
import { useAppTheme } from '@/context/app-theme';
import { useQuotesCatalog } from '@/context/QuotesCatalogContext';
import { searchQuotes } from '@/lib/quote-helpers';

export default function SearchScreen() {
  const t = useAppTheme();
  const { quotes } = useQuotesCatalog();
  const [q, setQ] = useState('');

  const results = useMemo(() => searchQuotes(quotes, q), [quotes, q]);

  return (
    <View style={[styles.flex, { backgroundColor: t.background }]}>
      <AppHeader
        title="Search"
        subtitle="Try sabr, mohabbat, zindagi…"
        showBack
        variant="brand"
      />
      <View style={styles.inputWrap}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search Urdu text"
          placeholderTextColor={t.textMuted}
          style={[
            styles.input,
            {
              backgroundColor: t.card,
              borderColor: t.border,
              color: t.text,
              fontFamily: FontUi.regular,
            },
          ]}
          autoFocus
          returnKeyType="search"
          accessibilityLabel="Search quotes"
        />
      </View>
      {q.trim().length === 0 ? (
        <View style={styles.hintWrap}>
          <Text style={[styles.hint, { color: t.textMuted, fontFamily: FontUi.regular }]}>
            Type a word to filter all categories.
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.hintWrap}>
          <Text style={[styles.hint, { color: t.textMuted, fontFamily: FontUi.regular }]}>
            No matches — try another spelling.
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <QuoteListItem quote={item} />}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  inputWrap: { paddingHorizontal: 16, paddingTop: 8 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  hintWrap: { padding: 24 },
  hint: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
});
