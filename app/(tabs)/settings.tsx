import { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenBody } from '@/components/layout/ScreenBody';
import { FontUi } from '@/constants/fonts';
import { useAppTheme } from '@/context/app-theme';
import type { ThemePreference } from '@/store/sukhan-store';
import { useSukhanStore } from '@/store/sukhan-store';
import { ensureNotificationPermissions } from '@/services/notifications';

const THEME_OPTIONS: { key: ThemePreference; label: string }[] = [
  { key: 'system', label: 'System' },
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
];

export default function SettingsScreen() {
  const t = useAppTheme();
  const themePreference = useSukhanStore((s) => s.themePreference);
  const setThemePreference = useSukhanStore((s) => s.setThemePreference);
  const notificationsEnabled = useSukhanStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useSukhanStore((s) => s.setNotificationsEnabled);
  const [permHint, setPermHint] = useState<string | null>(null);

  const onNotifToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    if (value && Platform.OS !== 'web') {
      const ok = await ensureNotificationPermissions();
      if (!ok) setPermHint('Enable notifications in system settings for alerts.');
      else setPermHint(null);
    } else {
      setPermHint(null);
    }
  };

  return (
    <View style={[styles.flex, { backgroundColor: t.background }]}>
      <AppHeader title="Settings" subtitle="Experience & alerts" variant="brand" />
      <ScreenBody>
        <Text style={[styles.section, { color: t.text, fontFamily: FontUi.bold }]}>Appearance</Text>
        <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
          {THEME_OPTIONS.map((opt) => {
            const selected = themePreference === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.row, { borderBottomColor: t.border }]}
                onPress={() => setThemePreference(opt.key)}
                accessibilityRole="button"
                accessibilityState={{ selected }}>
                <Text style={[styles.rowLabel, { color: t.text, fontFamily: FontUi.medium }]}>
                  {opt.label}
                </Text>
                <Text style={{ color: selected ? t.tint : t.textMuted, fontFamily: FontUi.semibold }}>
                  {selected ? '●' : '○'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.section, { color: t.text, fontFamily: FontUi.bold }]}>Notifications</Text>
        <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
          <View style={[styles.row, styles.rowLast]}>
            <View style={styles.switchCol}>
              <Text style={[styles.rowLabel, { color: t.text, fontFamily: FontUi.medium }]}>
                New quotes alerts
              </Text>
              <Text style={[styles.sub, { color: t.textMuted, fontFamily: FontUi.regular }]}>
                When the catalog version bumps after an update
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={onNotifToggle}
              trackColor={{ true: `${t.tint}88`, false: '#ccc' }}
              thumbColor={notificationsEnabled ? t.tint : '#f4f4f4'}
            />
          </View>
        </View>
        {permHint ? (
          <Text style={[styles.hint, { color: t.streak, fontFamily: FontUi.regular }]}>{permHint}</Text>
        ) : null}

        <Text style={[styles.footer, { color: t.textMuted, fontFamily: FontUi.regular }]}>
          Sukhan keeps quotes on-device. Analytics never leave your phone.
        </Text>
      </ScreenBody>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  section: { fontSize: 16, marginTop: 8, marginBottom: 10 },
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: { fontSize: 16 },
  switchCol: { flex: 1, paddingRight: 12 },
  sub: { fontSize: 13, marginTop: 4, lineHeight: 18 },
  hint: { fontSize: 13, marginTop: 8, marginHorizontal: 4 },
  footer: { fontSize: 13, lineHeight: 20, marginTop: 24 },
});
