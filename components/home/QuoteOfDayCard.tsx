import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { FontUi, FontUrdu } from '@/constants/fonts';
import { useAppTheme } from '@/context/app-theme';
import type { Quote } from '@/types/quote';
import { copyQuote, shareQuote, openWhatsAppStatus } from '@/services/share';

type QuoteOfDayCardProps = {
  quote: Quote;
};

export function QuoteOfDayCard({ quote }: QuoteOfDayCardProps) {
  const t = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: t.card, borderColor: t.border, shadowColor: t.shadow },
      ]}>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: `${t.tint}18` }]}>
            <Text style={[styles.badgeText, { color: t.tint, fontFamily: FontUi.semibold }]}>
              Quote of the day
            </Text>
          </View>
          <Text style={[styles.cat, { color: t.textMuted, fontFamily: FontUi.medium }]}>
            {quote.category}
          </Text>
        </View>
        <Text
          style={[styles.quote, { color: t.text, fontFamily: FontUrdu.semibold }]}
          accessibilityRole="text">
          {quote.text}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.iconBtn, { borderColor: t.border }]}
            onPress={() => copyQuote(quote.text)}
            accessibilityRole="button"
            accessibilityLabel="Copy quote">
            <Ionicons name="copy-outline" size={20} color={t.tint} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, { borderColor: t.border }]}
            onPress={() => openWhatsAppStatus(quote.text)}
            accessibilityRole="button"
            accessibilityLabel="Share to WhatsApp">
            <Ionicons name="logo-whatsapp" size={22} color={t.tint} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, { borderColor: t.border }]}
            onPress={() => shareQuote(quote.text)}
            accessibilityRole="button"
            accessibilityLabel="Share quote">
            <Ionicons name="share-outline" size={20} color={t.tint} />
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    elevation: 3,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontSize: 12 },
  cat: { fontSize: 12 },
  quote: {
    fontSize: 22,
    lineHeight: 34,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    justifyContent: 'flex-end',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
