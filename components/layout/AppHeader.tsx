import { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { FontUi } from '@/constants/fonts';
import { useAppTheme } from '@/context/app-theme';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: ReactNode;
  /** Teal bar like reference nav */
  variant?: 'brand' | 'surface';
};

export function AppHeader({
  title,
  subtitle,
  showBack,
  right,
  variant = 'brand',
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const t = useAppTheme();

  const barBg = variant === 'brand' ? t.headerBg : t.surface;
  const fg = variant === 'brand' ? t.headerText : t.text;

  return (
    <View style={[styles.wrap, { backgroundColor: barBg, paddingTop: insets.top }]}>
      <StatusBar
        barStyle={
          variant === 'brand'
            ? 'light-content'
            : t.scheme === 'dark'
              ? 'light-content'
              : 'dark-content'
        }
      />
      <View style={styles.row}>
        <View style={styles.left}>
          {showBack ? (
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={12}
              style={styles.backBtn}
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <Ionicons name="chevron-back" size={26} color={fg} />
            </TouchableOpacity>
          ) : null}
          <View style={showBack ? styles.titleShift : undefined}>
            <Text style={[styles.title, { color: fg, fontFamily: FontUi.bold }]} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={[styles.sub, { color: fg, opacity: 0.85, fontFamily: FontUi.medium }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: Platform.OS === 'ios' ? 36 : 42,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backBtn: {
    marginRight: 4,
    marginLeft: -4,
  },
  titleShift: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    letterSpacing: 0.2,
  },
  sub: {
    fontSize: 13,
    marginTop: 2,
  },
  right: {
    marginLeft: 12,
  },
});
