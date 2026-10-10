import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ImageBackground,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Shadows } from '@/constants/theme';
import { QUIZ_QUESTION_DEMO } from '@/constants/mockData';
import { dataService } from '@/services/dataService';

export default function QuizScreen() {
  const router = useRouter();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>('opt-b');
  const [isAnswerChecked, setIsAnswerChecked] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const question = QUIZ_QUESTION_DEMO;
  const isCorrect = selectedOptionId === question.correctOptionId;

  const handleSelectOption = (optionId: string) => {
    if (hasSubmitted) return;
    setSelectedOptionId(optionId);
    setIsAnswerChecked(true);
  };

  const handleContinue = async () => {
    if (!hasSubmitted && isCorrect) {
      setHasSubmitted(true);
      await dataService.recordQuizSuccess(question.feedback.points);
    }

    Alert.alert(
      '¡Evaluación Completada!',
      `Has sumado +${question.feedback.points} puntos a tu récord del Fundo Los Valles cumpliendo el estándar GlobalG.A.P.`,
      [
        {
          text: 'Volver al Inicio',
          onPress: () => router.replace('/(tabs)' as any),
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Fijo */}
      <View style={styles.topHeader}>
        <Pressable
          style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </Pressable>

        <View style={styles.streakPill}>
          <Ionicons name="flash" size={14} color="#D97706" />
          <Text style={styles.streakText}>{question.streakText}</Text>
        </View>

        <View style={styles.counterPill}>
          <Text style={styles.counterText}>
            {question.questionNumber} / {question.totalQuestions}
          </Text>
        </View>
      </View>

      {/* Barra de Progreso Superior */}
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${(question.questionNumber / question.totalQuestions) * 100}%` },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pills de Contexto de Campo */}
        <View style={styles.pillsRow}>
          <View style={styles.categoryPill}>
            <MaterialCommunityIcons name="content-cut" size={14} color="#1D7A46" />
            <Text style={styles.categoryPillText}>{question.categoryTag}</Text>
          </View>

          <View style={styles.locationPill}>
            <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.locationPillText}>{question.locationTag}</Text>
          </View>
        </View>

        {/* Título de la Pregunta */}
        <Text style={styles.questionTitle}>{question.title}</Text>

        {/* Imagen Ilustrativa del Racimo */}
        <View style={[styles.imageCard, Shadows.md]}>
          <ImageBackground
            source={question.imageUri}
            style={styles.grapeImage}
            resizeMode="cover"
          >
            <View style={styles.imageFocusPill}>
              <MaterialCommunityIcons name="shield-check" size={15} color="#FFFFFF" />
              <Text style={styles.imageFocusText}>{question.imageFocusText}</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Opciones de Respuesta */}
        <View style={styles.optionsList}>
          {question.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isOptionCorrect = option.id === question.correctOptionId;

            return (
              <Pressable
                key={option.id}
                style={({ pressed }) => [
                  styles.optionCard,
                  isSelected && isOptionCorrect && styles.optionCardCorrect,
                  isSelected && !isOptionCorrect && styles.optionCardWrong,
                  pressed && { opacity: 0.9 },
                  Shadows.sm,
                ]}
                onPress={() => handleSelectOption(option.id)}
              >
                <View
                  style={[
                    styles.letterCircle,
                    isSelected && isOptionCorrect && styles.letterCircleCorrect,
                  ]}
                >
                  <Text
                    style={[
                      styles.letterText,
                      isSelected && isOptionCorrect && styles.letterTextCorrect,
                    ]}
                  >
                    {option.letter}
                  </Text>
                </View>

                <Text style={styles.optionText}>{option.text}</Text>

                <View
                  style={[
                    styles.selectionCircle,
                    isSelected && isOptionCorrect && styles.selectionCircleCorrect,
                  ]}
                >
                  {isSelected && isOptionCorrect && (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Card de Feedback GlobalGAP (Si respondió la correcta) */}
        {isAnswerChecked && isCorrect && (
          <View style={[styles.feedbackCard, Shadows.md]}>
            <View style={styles.feedbackHeaderRow}>
              <View style={styles.leafIconCircle}>
                <MaterialCommunityIcons name="leaf" size={20} color="#1D7A46" />
              </View>

              <View style={styles.feedbackTitleCol}>
                <Text style={styles.feedbackTitle}>{question.feedback.title}</Text>
                <Text style={styles.feedbackSubtitle}>{question.feedback.subtitle}</Text>
              </View>

              <View style={styles.pointsPill}>
                <Text style={styles.pointsPillText}>+{question.feedback.points}</Text>
                <Text style={styles.pointsPillUnit}>pts</Text>
              </View>
            </View>

            <Text style={styles.feedbackExplanation}>{question.feedback.explanation}</Text>

            <View style={styles.standardTag}>
              <MaterialCommunityIcons name="shield-check" size={14} color="#1D7A46" />
              <Text style={styles.standardTagText}>{question.feedback.standardTag}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Botón Inferior Fijo */}
      <View style={[styles.bottomBar, Shadows.lg]}>
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continuar a la siguiente pregunta</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 48,
    paddingBottom: Spacing.sm,
    backgroundColor: '#FFFFFF',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F3ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  streakText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: 0.3,
  },
  counterPill: {
    backgroundColor: '#F0F3ED',
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2EBE4',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 110,
    gap: Spacing.md,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D7F5DE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D7A46',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EDF1EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  locationPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  questionTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  imageCard: {
    height: 160,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  grapeImage: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.md,
  },
  imageFocusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(14, 58, 40, 0.85)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  imageFocusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  optionsList: {
    gap: Spacing.md,
  },
  optionCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  optionCardCorrect: {
    backgroundColor: '#EBF6EE',
    borderColor: '#73C686',
  },
  optionCardWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  letterCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F0F3ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterCircleCorrect: {
    backgroundColor: Colors.primary,
  },
  letterText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  letterTextCorrect: {
    color: '#FFFFFF',
  },
  optionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  selectionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F3ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionCircleCorrect: {
    backgroundColor: '#1B5E20',
  },
  feedbackCard: {
    backgroundColor: '#EDF6EF',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: '#C7E4CC',
  },
  feedbackHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  leafIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D7F5DE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackTitleCol: {
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  feedbackSubtitle: {
    fontSize: 11,
    color: '#1D7A46',
    fontWeight: '600',
  },
  pointsPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  pointsPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
    lineHeight: 15,
  },
  pointsPillUnit: {
    fontSize: 9,
    fontWeight: '700',
    color: '#92400E',
    lineHeight: 11,
  },
  feedbackExplanation: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  standardTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  standardTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D7A46',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 28 : Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
