import { useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  RefreshControl,
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import PersonCard from '../../src/components/PersonCard';
import { usePeople } from '../../src/context/PeopleContext';
import { colors, shadows, borderRadius, spacing } from '../../src/theme/colors';

export default function PeopleList() {
  const { people, refresh } = usePeople();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Memory Cards</Text>
        <Link href="/(tabs)/add" asChild>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
            <Ionicons name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </Link>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {people.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="people-outline" size={48} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No loved ones yet</Text>
            <Text style={styles.emptySubtitle}>
              Add someone special so Rinku can help you remember them
            </Text>
            <Link href="/(tabs)/add" asChild>
              <TouchableOpacity style={[styles.emptyButton, shadows.button]} activeOpacity={0.8}>
                <Ionicons name="person-add" size={20} color={colors.textOnAccent} />
                <Text style={styles.emptyButtonText}>Add Someone</Text>
              </TouchableOpacity>
            </Link>
          </View>
        ) : (
          <>
            {/* Grid View */}
            <View style={styles.grid}>
              {people.map((person) => (
                <PersonCard 
                  key={person._id} 
                  person={person} 
                  variant="grid"
                />
              ))}
            </View>

            {/* List View with details */}
            <Text style={styles.sectionTitle}>All People</Text>
            <View style={styles.list}>
              {people.map((person) => (
                <PersonCard 
                  key={person._id} 
                  person={person} 
                  variant="list"
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  list: {
    gap: spacing.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: spacing.lg,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accentLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textOnAccent,
  },
});
