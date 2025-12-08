import { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Animated,
  Easing,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePeople } from '../../src/context/PeopleContext';
import { SpeechAPI } from '../../src/services/speech';
import { playUrl, stopAudio } from '../../src/services/audio';
import { matchFace } from '../../src/services/faceRecognition';
import { colors, shadows, borderRadius, spacing } from '../../src/theme/colors';
import { Person } from '../../src/types/domain';

export default function Recognize() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const { people, refresh } = usePeople();
  const [recognizedPerson, setRecognizedPerson] = useState<Person | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [matchConfidence, setMatchConfidence] = useState<number>(0);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  
  // Animations
  const waveAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
    refresh();
  }, [permission]);

  useEffect(() => {
    if (isProcessing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      waveAnim.setValue(0);
      pulseAnim.setValue(1);
    }
  }, [isProcessing]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  async function captureAndRecognize() {
    if (!cameraRef.current) return;
    
    if (!people.length) {
      Alert.alert(
        'No People Added', 
        'Add someone in Memory Cards first so Rinku can help you remember them.',
        [{ text: 'Add Someone', onPress: () => router.push('/(tabs)/add') }]
      );
      return;
    }

    setIsProcessing(true);
    setAudioError(null);
    setCapturedPhoto(null);

    try {
      // Take a photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });

      if (!photo?.uri) {
        throw new Error('Failed to capture photo');
      }

      setCapturedPhoto(photo.uri);

      // Match the face (MVP version - matches against stored photos)
      const match = await matchFace(photo.uri, people);

      if (match.matched && match.person) {
        setRecognizedPerson(match.person);
        setMatchConfidence(match.confidence);

        // Play the audio announcement
        try {
          setIsPlaying(true);
          const url = await SpeechAPI.relationshipUrl(match.person._id);
          await playUrl(url);
        } catch (audioErr: any) {
          console.error('Audio error:', audioErr);
          setAudioError(audioErr.message || 'Could not play audio');
        } finally {
          setIsPlaying(false);
        }
      } else {
        Alert.alert(
          'No Match Found',
          match.message || 'Try adding this person to your memory cards.',
          [
            { text: 'Add Them', onPress: () => router.push('/(tabs)/add') },
            { text: 'Try Again', style: 'cancel' },
          ]
        );
      }
    } catch (error: any) {
      console.error('Recognition error:', error);
      Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }

  function clearRecognition() {
    stopAudio();
    setRecognizedPerson(null);
    setAudioError(null);
    setCapturedPhoto(null);
    setMatchConfidence(0);
  }

  async function playAgain() {
    if (!recognizedPerson) return;
    
    try {
      setIsPlaying(true);
      setAudioError(null);
      const url = await SpeechAPI.relationshipUrl(recognizedPerson._id);
      await playUrl(url);
    } catch (error: any) {
      setAudioError(error.message || 'Could not play audio');
    } finally {
      setIsPlaying(false);
    }
  }

  // Processing state
  if (isProcessing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.processingContainer}>
          <Animated.View style={[styles.processingIcon, { transform: [{ scale: pulseAnim }] }]}>
            <Ionicons name="scan" size={64} color={colors.primary} />
          </Animated.View>
          
          <Text style={styles.processingTitle}>Recognizing...</Text>
          
          <View style={styles.waveContainer}>
            {[...Array(5)].map((_, i) => (
              <Animated.View 
                key={i}
                style={[
                  styles.waveBar,
                  {
                    transform: [{
                      scaleY: waveAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3 + (i % 3) * 0.2, 1 - (i % 2) * 0.3],
                      }),
                    }],
                  }
                ]}
              />
            ))}
          </View>
          
          <Text style={styles.processingHint}>Looking for a familiar face...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Recognition result
  if (recognizedPerson) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.resultContainer}>
          {/* Photo */}
          <View style={styles.photoContainer}>
            {capturedPhoto ? (
              <Image source={{ uri: capturedPhoto }} style={styles.capturedPhoto} />
            ) : recognizedPerson.photos?.[0]?.uri ? (
              <Image source={{ uri: recognizedPerson.photos[0].uri }} style={styles.capturedPhoto} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="person" size={64} color={colors.textMuted} />
              </View>
            )}
            
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>
                {Math.round(matchConfidence * 100)}% match
              </Text>
            </View>
          </View>

          {/* Result card */}
          <View style={[styles.resultCard, shadows.card]}>
            <Text style={styles.resultText}>
              This is{' '}
              <Text style={styles.resultHighlight}>
                {recognizedPerson.familiarName || recognizedPerson.displayName}
              </Text>
              , your{' '}
              <Text style={styles.resultHighlight}>
                {recognizedPerson.relationship}
              </Text>
              .
              {recognizedPerson.prompts?.[0] && (
                <Text> {recognizedPerson.prompts[0].text}</Text>
              )}
            </Text>

            {isPlaying && (
              <View style={styles.audioStatus}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.audioStatusText}>Speaking...</Text>
              </View>
            )}
            
            {audioError && (
              <View style={styles.audioError}>
                <Ionicons name="volume-mute" size={16} color={colors.error} />
                <Text style={styles.audioErrorText}>{audioError}</Text>
              </View>
            )}

            <View style={styles.resultActions}>
              <TouchableOpacity 
                style={styles.playButton}
                onPress={playAgain}
                disabled={isPlaying}
              >
                <Ionicons name="volume-high" size={20} color={colors.primary} />
                <Text style={styles.playButtonText}>Play Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.resultButton}
                onPress={() => router.push(`/edit/${recognizedPerson._id}`)}
              >
                <Text style={styles.resultButtonText}>Edit Memory</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={clearRecognition}>
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Camera permission not granted
  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIcon}>
            <Ionicons name="camera-outline" size={48} color={colors.textMuted} />
          </View>
          <Text style={styles.permissionTitle}>Camera Access</Text>
          <Text style={styles.permissionText}>
            Rinku needs camera access to recognize your loved ones
          </Text>
          <TouchableOpacity 
            style={[styles.permissionButton, shadows.button]}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Allow Camera</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main camera view
  return (
    <View style={styles.cameraContainer}>
      <CameraView 
        ref={cameraRef} 
        style={styles.camera} 
        facing="back"
      />
      
      {/* Face guide overlay */}
      <View style={styles.faceGuide}>
        <View style={styles.faceGuideOval} />
      </View>
      
      {/* Controls overlay */}
      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        <View style={styles.cameraHeader}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={colors.card} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Point at a face</Text>
          
          <View style={styles.headerButton} />
        </View>

        <View style={styles.cameraControls}>
          <View style={styles.controlsCard}>
            <Text style={styles.controlsHint}>
              {people.length === 0 
                ? 'Add people with photos first'
                : `${people.filter(p => p.photos?.length).length}/${people.length} people have photos`
              }
            </Text>
            
            <TouchableOpacity
              style={[styles.captureButton, shadows.card]}
              onPress={captureAndRecognize}
              disabled={people.length === 0}
            >
              <Ionicons name="scan-circle" size={32} color={colors.card} />
              <Text style={styles.captureButtonText}>Who is this?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Processing state
  processingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  processingIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  processingTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    gap: 8,
    marginBottom: spacing.lg,
  },
  waveBar: {
    width: 6,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  processingHint: {
    fontSize: 16,
    color: colors.textSecondary,
  },

  // Result state
  resultContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  photoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  capturedPhoto: {
    width: 220,
    height: 280,
    borderRadius: borderRadius.xl,
  },
  photoPlaceholder: {
    width: 220,
    height: 280,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.photoBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confidenceBadge: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  confidenceText: {
    color: colors.card,
    fontSize: 13,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  resultText: {
    fontSize: 18,
    color: colors.textPrimary,
    lineHeight: 28,
    marginBottom: spacing.md,
  },
  resultHighlight: {
    fontWeight: '700',
  },
  audioStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.cardAlt,
    borderRadius: borderRadius.md,
  },
  audioStatusText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  audioError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: '#FEE',
    borderRadius: borderRadius.md,
  },
  audioErrorText: {
    fontSize: 13,
    color: colors.error,
    flex: 1,
  },
  resultActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  playButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  playButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  resultButton: {
    flex: 1,
    backgroundColor: colors.accentLight,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  resultButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textOnAccent,
  },
  closeButton: {
    backgroundColor: colors.card,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  // Permission state
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  permissionIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  permissionText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: spacing.lg,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },

  // Camera view
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  faceGuide: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceGuideOval: {
    width: 200,
    height: 260,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    borderStyle: 'dashed',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    color: colors.card,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  cameraControls: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  controlsCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
  },
  controlsHint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
  },
  captureButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
  },
});
