import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { FontUi, FontUrdu } from '@/constants/fonts';
import { useAppTheme } from '@/context/app-theme';
import type { Quote } from '@/types/quote';
import { copyQuote, shareQuote, openWhatsAppStatus } from '@/services/share';
import { useSukhanStore } from '@/store/sukhan-store';

type QuoteListItemProps = {
  quote: Quote;
};

function QuoteListItemInner({ quote }: QuoteListItemProps) {
  const t = useAppTheme();
  const isFav = useSukhanStore((s) => s.favoriteIds.includes(quote.id));
  const toggleFavorite = useSukhanStore((s) => s.toggleFavorite);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: t.card, borderColor: t.border, shadowColor: t.shadow },
      ]}>
      <View style={styles.topRow}>
        <Text style={[styles.cat, { color: t.tint, fontFamily: FontUi.semibold }]}>
          {quote.category}
        </Text>
        <TouchableOpacity
          onPress={() => toggleFavorite(quote.id, quote.category)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={isFav ? 'Remove from favorites' : 'Add to favorites'}>
          <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={22} color={isFav ? t.streak : t.textMuted} />
        </TouchableOpacity>
      </View>
      <Text
        style={[styles.body, { color: t.text, fontFamily: FontUrdu.regular }]}
        accessibilityRole="text">
        {quote.text}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.chip, { borderColor: t.border }]}
          onPress={() => copyQuote(quote.text)}>
          <Ionicons name="copy-outline" size={18} color={t.tint} />
          <Text style={[styles.chipLabel, { color: t.tint, fontFamily: FontUi.medium }]}>Copy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, { borderColor: t.border }]}
          onPress={() => openWhatsAppStatus(quote.text)}>
          <Ionicons name="logo-whatsapp" size={18} color={t.tint} />
          <Text style={[styles.chipLabel, { color: t.tint, fontFamily: FontUi.medium }]}>Status</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, { borderColor: t.border }]}
          onPress={() => shareQuote(quote.text)}>
          <Ionicons name="share-outline" size={18} color={t.tint} />
          <Text style={[styles.chipLabel, { color: t.tint, fontFamily: FontUi.medium }]}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const QuoteListItem = memo(QuoteListItemInner);

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cat: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 },
  body: {
    fontSize: 19,
    lineHeight: 32,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipLabel: { fontSize: 13 },
});
