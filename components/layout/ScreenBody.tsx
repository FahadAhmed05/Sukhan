import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle, RefreshControl } from 'react-native';

import { useAppTheme } from '@/context/app-theme';

type ScreenBodyProps = {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  padded?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function ScreenBody({
  children,
  scroll = true,
  contentStyle,
  padded = true,
  refreshing,
  onRefresh,
}: ScreenBodyProps) {
  const t = useAppTheme();
  const pad = padded ? styles.pad : undefined;

  if (scroll) {
    return (
      <ScrollView
        style={[styles.flex, { backgroundColor: t.background }]}
        contentContainerStyle={[styles.grow, pad, contentStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={t.tint} />
          ) : undefined
        }>
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: t.background }, pad, contentStyle]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
  pad: { padding: 16, paddingBottom: 28 },
});
