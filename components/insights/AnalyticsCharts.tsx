import { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, useWindowDimensions } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';

import { CATEGORY_ORDER } from '@/constants/categories';
import { FontUi } from '@/constants/fonts';
import { useAppTheme } from '@/context/app-theme';
import { lastNDayKeys, shortLabel } from '@/lib/chart-data';
import { useSukhanStore } from '@/store/sukhan-store';

const CATEGORY_COLORS = ['#008080', '#00796B', '#26A69A', '#4DB6AC', '#80CBC4'];

export function AnalyticsCharts() {
  const t = useAppTheme();
  const { width } = useWindowDimensions();
  const chartW = Math.min(width - 32, Dimensions.get('window').width - 32);

  const categoryViews = useSukhanStore((s) => s.categoryViews);
  const favoritesByCategory = useSukhanStore((s) => s.favoritesByCategory);
  const dailyAppOpens = useSukhanStore((s) => s.dailyAppOpens);
  const copyCount = useSukhanStore((s) => s.copyCount);
  const favoriteIds = useSukhanStore((s) => s.favoriteIds);

  const chartConfig = useMemo(
    () => ({
      backgroundGradientFrom: t.card,
      backgroundGradientTo: t.card,
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`,
      labelColor: (opacity = 1) =>
        t.scheme === 'dark' ? `rgba(232, 245, 244, ${opacity})` : `rgba(13, 61, 60, ${opacity})`,
      propsForBackgroundLines: {
        strokeDasharray: '',
        stroke: t.border,
        strokeWidth: 1,
      },
    }),
    [t],
  );

  const barData = useMemo(() => {
    const labels = CATEGORY_ORDER.map((c) => c.slice(0, 4));
    const data = CATEGORY_ORDER.map((c) => favoritesByCategory[c] ?? 0);
    return { labels, data };
  }, [favoritesByCategory]);

  const lineData = useMemo(() => {
    const keys = lastNDayKeys(7);
    const labels = keys.map(shortLabel);
    const data = keys.map((k) => dailyAppOpens[k] ?? 0);
    return { labels, data };
  }, [dailyAppOpens]);

  const pieData = useMemo(() => {
    const entries = CATEGORY_ORDER.map((c) => ({
      name: c,
      population: categoryViews[c] ?? 0,
      color: CATEGORY_COLORS[CATEGORY_ORDER.indexOf(c) % CATEGORY_COLORS.length],
      legendFontColor: t.textMuted,
      legendFontSize: 12,
    })).filter((e) => e.population > 0);

    const total = entries.reduce((a, e) => a + e.population, 0);
    return { entries, total };
  }, [categoryViews, t.textMuted]);

  const hasBar = barData.data.some((n) => n > 0);
  const hasLine = lineData.data.some((n) => n > 0);
  const hasPie = pieData.total > 0;

  return (
    <View style={styles.block}>
      <Text style={[styles.sectionTitle, { color: t.text, fontFamily: FontUi.bold }]}>
        Library at a glance
      </Text>
      <View style={[styles.statRow, { backgroundColor: t.card, borderColor: t.border }]}>
        <StatPill label="Copies" value={String(copyCount)} accent={t.tint} />
        <StatPill label="Favorites" value={String(favoriteIds.length)} accent={t.tint} />
        <StatPill label="Topics opened" value={String(Object.keys(categoryViews).length)} accent={t.tint} />
      </View>

      <Text style={[styles.chartTitle, { color: t.text, fontFamily: FontUi.semibold }]}>
        Favorite categories
      </Text>
      {hasBar ? (
        <BarChart
          width={chartW}
          height={220}
          data={{
            labels: barData.labels,
            datasets: [{ data: barData.data }],
          }}
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          fromZero
          style={styles.chart}
          yAxisLabel=""
          yAxisSuffix=""
          showValuesOnTopOfBars
        />
      ) : (
        <EmptyChart hint="Favorite a few quotes to see this chart." t={t} />
      )}

      <Text style={[styles.chartTitle, { color: t.text, fontFamily: FontUi.semibold }]}>
        Opens per day (7 days)
      </Text>
      {hasLine ? (
        <LineChart
          width={chartW}
          height={220}
          data={{
            labels: lineData.labels,
            datasets: [{ data: lineData.data }],
          }}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          fromZero
        />
      ) : (
        <EmptyChart hint="Open the app across multiple days to unlock this trend." t={t} />
      )}

      <Text style={[styles.chartTitle, { color: t.text, fontFamily: FontUi.semibold }]}>
        Reading interest by category
      </Text>
      {hasPie ? (
        <PieChart
          data={pieData.entries}
          width={chartW}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
          style={styles.chart}
        />
      ) : (
        <EmptyChart hint="Browse categories from Home to populate interest share." t={t} />
      )}
    </View>
  );
}

function StatPill({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  const t = useAppTheme();
  return (
    <View style={styles.pill}>
      <Text style={[styles.pillValue, { color: accent, fontFamily: FontUi.bold }]}>{value}</Text>
      <Text style={[styles.pillLabel, { color: t.textMuted, fontFamily: FontUi.regular }]}>{label}</Text>
    </View>
  );
}

function EmptyChart({ hint, t }: { hint: string; t: ReturnType<typeof useAppTheme> }) {
  return (
    <View style={[styles.empty, { borderColor: t.border, backgroundColor: t.card }]}>
      <Text style={[styles.emptyText, { color: t.textMuted, fontFamily: FontUi.regular }]}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 8 },
  sectionTitle: { fontSize: 18, marginBottom: 8 },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 16,
    gap: 4,
  },
  pill: { flex: 1, alignItems: 'center' },
  pillValue: { fontSize: 18 },
  pillLabel: { fontSize: 11, textAlign: 'center', marginTop: 4 },
  chartTitle: { fontSize: 15, marginTop: 12, marginBottom: 4 },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  empty: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 20,
    marginVertical: 8,
  },
  emptyText: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
});
