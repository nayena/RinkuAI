import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows, borderRadius, spacing } from '../theme/colors';
import { Person } from '../types/domain';

interface PersonCardProps {
  person: Person;
  variant?: 'grid' | 'list' | 'detail';
  onPress?: () => void;
}

export default function PersonCard({ person, variant = 'list', onPress }: PersonCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to edit page
      router.push(`/edit/${person._id}`);
    }
  };

  if (variant === 'grid') {
    return (
      <TouchableOpacity style={styles.gridCard} onPress={handlePress} activeOpacity={0.8}>
        <View style={styles.avatarContainer}>
          {person.photos?.[0]?.uri ? (
            <Image source={{ uri: person.photos[0].uri }} style={styles.gridAvatar} />
          ) : (
            <View style={[styles.gridAvatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={32} color={colors.textMuted} />
            </View>
          )}
        </View>
        <Text style={styles.gridName}>{person.familiarName || person.displayName}</Text>
        <Text style={styles.gridRelationship}>{person.relationship}</Text>
      </TouchableOpacity>
    );
  }

  if (variant === 'detail') {
    return (
      <View style={[styles.detailCard, shadows.card]}>
        <View style={styles.detailHeader}>
          {person.photos?.[0]?.uri ? (
            <Image source={{ uri: person.photos[0].uri }} style={styles.detailAvatar} />
          ) : (
            <View style={[styles.detailAvatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={48} color={colors.textMuted} />
            </View>
          )}
        </View>
        <Text style={styles.detailName}>{person.displayName}</Text>
        <Text style={styles.detailRelationship}>Your {person.relationship}</Text>
        {person.prompts?.[0] && (
          <View style={styles.promptContainer}>
            <Text style={styles.promptLabel}>Connection Prompt</Text>
            <Text style={styles.promptText}>{person.prompts[0].text}</Text>
          </View>
        )}
      </View>
    );
  }

  // List variant (default)
  return (
    <TouchableOpacity 
      style={[styles.listCard, shadows.button]} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.listAvatarContainer}>
        {person.photos?.[0]?.uri ? (
          <Image source={{ uri: person.photos[0].uri }} style={styles.listAvatar} />
        ) : (
          <View style={[styles.listAvatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={24} color={colors.textMuted} />
          </View>
        )}
      </View>
      <View style={styles.listContent}>
        <Text style={styles.listName}>{person.familiarName || person.displayName}</Text>
        <Text style={styles.listRelationship}>{person.relationship}</Text>
      </View>
      <View style={styles.editHint}>
        <Text style={styles.editHintText}>Tap to edit</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Grid variant
  gridCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    width: 140,
    ...shadows.card,
  },
  avatarContainer: {
    marginBottom: spacing.sm,
  },
  gridAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.cardAlt,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardAlt,
  },
  gridName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  gridRelationship: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },

  // List variant
  listCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  listAvatarContainer: {
    marginRight: spacing.md,
  },
  listAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.cardAlt,
  },
  listContent: {
    flex: 1,
  },
  listName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  listRelationship: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  editHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editHintText: {
    fontSize: 12,
    color: colors.textMuted,
  },

  // Detail variant
  detailCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  detailHeader: {
    marginBottom: spacing.md,
  },
  detailAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.cardAlt,
  },
  detailName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  detailRelationship: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  promptContainer: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.cardAlt,
    borderRadius: borderRadius.md,
    width: '100%',
  },
  promptLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  promptText: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
});
