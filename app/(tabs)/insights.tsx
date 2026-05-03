import { View, StyleSheet } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenBody } from '@/components/layout/ScreenBody';
import { AnalyticsCharts } from '@/components/insights/AnalyticsCharts';
import { useAppTheme } from '@/context/app-theme';

export default function InsightsScreen() {
  const t = useAppTheme();

  return (
    <View style={[styles.flex, { backgroundColor: t.background }]}>
      <AppHeader title="Insights" subtitle="How you use Sukhan" variant="brand" />
      <ScreenBody>
        <AnalyticsCharts />
      </ScreenBody>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
