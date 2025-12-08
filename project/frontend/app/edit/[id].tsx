import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { usePeople } from '../../src/context/PeopleContext';
import { colors, shadows, borderRadius, spacing } from '../../src/theme/colors';
import { createFaceData } from '../../src/services/faceRecognition';

export default function EditPerson() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getById, update, remove } = usePeople();
  const person = getById(id);

  const [displayName, setDisplayName] = useState('');
  const [familiarName, setFamiliarName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [prompt, setPrompt] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (person) {
      setDisplayName(person.displayName);
      setFamiliarName(person.familiarName || '');
      setRelationship(person.relationship);
      setPrompt(person.prompts?.[0]?.text || '');
      setPhotoUri(person.photos?.[0]?.uri || null);
    }
  }, [person]);

  const relationshipSuggestions = [
    'daughter', 'son', 'spouse', 'grandchild', 
    'friend', 'neighbor', 'caregiver', 'sibling'
  ];

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow camera access.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  function showPhotoOptions() {
    Alert.alert('Change Photo', 'Choose how to add a photo', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  async function onSave() {
    if (!displayName || !relationship) {
      return Alert.alert('Required Fields', 'Please enter a name and relationship');
    }

    setSaving(true);
    try {
      const faceData = photoUri ? createFaceData(photoUri) : undefined;
      
      await update(id, {
        displayName,
        familiarName: familiarName || undefined,
        relationship,
        prompts: prompt ? [{ text: prompt }] : [],
        photos: photoUri ? [{ uri: photoUri }] : [],
        faceData,
      });
      Alert.alert('Success', 'Memory card updated!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Could not save. Please try again.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    Alert.alert(
      'Delete Memory Card',
      `Are you sure you want to remove ${person?.familiarName || person?.displayName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await remove(id);
              router.replace('/(tabs)/people');
            } catch (error) {
              Alert.alert('Error', 'Could not delete. Please try again.');
            }
          },
        },
      ]
    );
  }

  if (!person) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Person not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Memory</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Ionicons name="trash-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar / Photo picker */}
          <View style={styles.avatarSection}>
            <TouchableOpacity 
              style={[styles.avatar, photoUri && styles.avatarWithPhoto]} 
              onPress={showPhotoOptions}
            >
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatarImage} />
              ) : (
                <>
                  <Ionicons name="camera" size={32} color={colors.textMuted} />
                  <Text style={styles.avatarText}>Add Photo</Text>
                </>
              )}
            </TouchableOpacity>
            {photoUri && (
              <TouchableOpacity style={styles.changePhotoButton} onPress={showPhotoOptions}>
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Sofia Martinez"
                placeholderTextColor={colors.textMuted}
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>What do you call them?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Sofía, Mom, Grandpa Joe"
                placeholderTextColor={colors.textMuted}
                value={familiarName}
                onChangeText={setFamiliarName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Relationship</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. granddaughter"
                placeholderTextColor={colors.textMuted}
                value={relationship}
                onChangeText={setRelationship}
              />
              <View style={styles.suggestions}>
                {relationshipSuggestions.slice(0, 4).map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.suggestionChip,
                      relationship === r && styles.suggestionChipActive
                    ]}
                    onPress={() => setRelationship(r)}
                  >
                    <Text style={[
                      styles.suggestionText,
                      relationship === r && styles.suggestionTextActive
                    ]}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Connection Prompt</Text>
              <Text style={styles.labelHint}>A memory to help reconnect</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="e.g. She loves painting with you"
                placeholderTextColor={colors.textMuted}
                value={prompt}
                onChangeText={setPrompt}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, shadows.button, saving && styles.saveButtonDisabled]}
            onPress={onSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  backLink: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  avatarWithPhoto: {
    borderStyle: 'solid',
    borderColor: colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  changePhotoButton: {
    marginTop: spacing.sm,
  },
  changePhotoText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  form: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  labelHint: {
    fontSize: 13,
    color: colors.textMuted,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  suggestionChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  suggestionTextActive: {
    color: colors.card,
    fontWeight: '600',
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  saveButton: {
    backgroundColor: colors.accentLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textOnAccent,
  },
});
