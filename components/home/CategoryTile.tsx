import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { FontUi } from '@/constants/fonts';
import { useAppTheme } from '@/context/app-theme';
import type { QuoteCategory } from '@/types/quote';

const CATEGORY_ICONS: Record<QuoteCategory, keyof typeof Ionicons.glyphMap> = {
  Islamic: 'moon-outline',
  Motivation: 'flash-outline',
  Sad: 'rainy-outline',
  Love: 'heart-outline',
  Life: 'leaf-outline',
};

type CategoryTileProps = {
  category: QuoteCategory;
  count: number;
  onPress: () => void;
};

export function CategoryTile({ category, count, onPress }: CategoryTileProps) {
  const t = useAppTheme();
  const icon = CATEGORY_ICONS[category];

  return (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor: t.card, borderColor: t.border, shadowColor: t.shadow }]}
      onPress={onPress}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel={`${category}, ${count} quotes`}>
      <View style={[styles.iconWrap, { backgroundColor: `${t.tint}14` }]}>
        <Ionicons name={icon} size={26} color={t.tint} />
      </View>
      <Text style={[styles.title, { color: t.text, fontFamily: FontUi.semibold }]}>{category}</Text>
      <Text style={[styles.count, { color: t.textMuted, fontFamily: FontUi.regular }]}>
        {count} quotes
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 16 },
  count: { fontSize: 13, marginTop: 4 },
});
