import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows, borderRadius, spacing } from '../../src/theme/colors';

export default function Home() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>Friend</Text>
        </View>

        {/* Main Action - Ask Rinku */}
        <Link href="/(tabs)/recognize" asChild>
          <TouchableOpacity style={[styles.mainCard, shadows.card]} activeOpacity={0.9}>
            <View style={styles.iconCircle}>
              <Ionicons name="chatbubble-ellipses" size={28} color={colors.primary} />
            </View>
            <Text style={styles.mainCardTitle}>Ask Rinku</Text>
            <Text style={styles.mainCardSubtitle}>
              Point at someone and I'll help you remember them
            </Text>
          </TouchableOpacity>
        </Link>

        {/* Quick Actions */}
        <View style={styles.actionsGrid}>
          <Link href="/(tabs)/people" asChild>
            <TouchableOpacity style={[styles.actionCard, shadows.button]} activeOpacity={0.8}>
              <View style={[styles.actionIcon, { backgroundColor: colors.accentLight }]}>
                <Ionicons name="people" size={24} color={colors.accent} />
              </View>
              <Text style={styles.actionTitle}>Memory Cards</Text>
              <Text style={styles.actionSubtitle}>View loved ones</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(tabs)/add" asChild>
            <TouchableOpacity style={[styles.actionCard, shadows.button]} activeOpacity={0.8}>
              <View style={[styles.actionIcon, { backgroundColor: '#E8F0E8' }]}>
                <Ionicons name="person-add" size={24} color={colors.success} />
              </View>
              <Text style={styles.actionTitle}>Add Someone</Text>
              <Text style={styles.actionSubtitle}>New memory</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Listening prompt suggestions */}
        <View style={styles.suggestionsSection}>
          <Text style={styles.suggestionsTitle}>Try saying...</Text>
          <View style={styles.suggestions}>
            <View style={styles.suggestionPill}>
              <Text style={styles.suggestionText}>"Who is this?"</Text>
            </View>
            <View style={styles.suggestionPill}>
              <Text style={styles.suggestionText}>"Show my family"</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: -4,
  },
  mainCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  mainCardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  mainCardSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  suggestionsSection: {
    marginTop: 'auto',
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  suggestionPill: {
    backgroundColor: colors.card,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
