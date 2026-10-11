import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Shadows } from '@/constants/theme';
import { dataService } from '@/services/dataService';
import { QuizQuestion } from '@/types';

export default function QuizScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [loaded, setLoaded] = useState<{ id: string; questions: QuizQuestion[] } | null>(null);
  const [failedId, setFailedId] = useState<string | null>(null);
  const quizId = String(id ?? '');

  useEffect(() => {
    let isActive = true;
    dataService.getQuizQuestions(quizId).then((data) => {
      if (!isActive) return;
      if (data.length > 0) setLoaded({ id: quizId, questions: data });
      else setFailedId(quizId);
    }).catch((error) => {
      console.warn('Error loading quiz:', error);
      if (isActive) setFailedId(quizId);
    });

    return () => {
      isActive = false;
    };
  }, [quizId]);

  if (failedId === quizId) {
    return (
      <View style={[styles.screen, styles.centerState]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={44} color={Colors.textSecondary} />
        <Text style={styles.feedbackTitle}>Evaluación no disponible</Text>
        <Text style={[styles.feedbackExplanation, { textAlign: 'center' }]}>
          No se encontró esta evaluación. Vuelve a los módulos e inténtalo de nuevo.
        </Text>
        <Pressable style={styles.continueButton} onPress={() => router.replace('/learn' as any)}>
          <Text style={styles.continueButtonText}>Volver a módulos</Text>
        </Pressable>
      </View>
    );
  }

  if (!loaded || loaded.id !== quizId) return <View style={styles.screen} />;

  // El examen solo se monta cuando las preguntas ya existen.
  return <QuizRunner key={quizId} questions={loaded.questions} />;
}

function QuizRunner({ questions }: { questions: QuizQuestion[] }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const submissionInProgress = useRef(false);

  const goToLearn = () => router.replace('/learn' as any);
  const goBack = () => (router.canGoBack() ? router.back() : goToLearn());

  const question = questions[Math.min(questionIndex, questions.length - 1)];
  const isCorrect = selectedOptionId === question.correctOptionId;
  const totalPoints = questions.reduce((total, item) => total + item.feedback.points, 0);

  const handleSelectOption = (optionId: string) => {
    if (hasSubmitted || isAnswerChecked) return;
    setSelectedOptionId(optionId);
    setNotice(null);
  };

  const handleContinue = async () => {
    if (hasSubmitted) {
      goToLearn();
      return;
    }
    if (!selectedOptionId) {
      setNotice('Selecciona una opción para continuar con la evaluación.');
      return;
    }

    if (!isAnswerChecked) {
      setIsAnswerChecked(true);
      setAnswers((previous) => {
        const updated = [...previous];
        updated[questionIndex] = isCorrect;
        return updated;
      });
      return;
    }

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1);
      setSelectedOptionId(null);
      setIsAnswerChecked(false);
      setNotice(null);
      return;
    }

    if (submissionInProgress.current) return;

    const finalPoints = questions.reduce(
      (points, item, index) => points + (answers[index] ? item.feedback.points : 0),
      0
    );
    const finalCorrectAnswers = answers.filter(Boolean).length;
    submissionInProgress.current = true;
    try {
      await dataService.recordQuizSuccess(question.quizId, finalPoints);
      setEarnedPoints(finalPoints);
      setCorrectAnswers(finalCorrectAnswers);
      setHasSubmitted(true);
    } catch (error) {
      submissionInProgress.current = false;
      console.warn('Error saving quiz result:', error);
      setNotice('No se pudo guardar el resultado. Vuelve a intentarlo en unos momentos.');
      return;
    }
  };

  const renderOptions = () => (
    <View style={styles.optionsList}>
      {question.options.map((option) => {
        const isSelected = selectedOptionId === option.id;
        const isOptionCorrect = option.id === question.correctOptionId;
        const revealCorrect = isAnswerChecked && !isSelected && isOptionCorrect && !isCorrect;

        return (
          <Pressable
            key={option.id}
            style={({ pressed }) => [
              styles.optionCard,
              isSelected && !isAnswerChecked && styles.optionCardSelected,
              isAnswerChecked && (isSelected || revealCorrect) && isOptionCorrect && styles.optionCardCorrect,
              isAnswerChecked && isSelected && !isOptionCorrect && styles.optionCardWrong,
              pressed && { opacity: 0.9 },
              Shadows.sm,
            ]}
            onPress={() => handleSelectOption(option.id)}
            disabled={isAnswerChecked}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected, disabled: isAnswerChecked }}
          >
            <View
              style={[
                styles.letterCircle,
                isAnswerChecked && (isSelected || revealCorrect) && isOptionCorrect && styles.letterCircleCorrect,
              ]}
            >
              <Text
                style={[
                  styles.letterText,
                  isAnswerChecked && (isSelected || revealCorrect) && isOptionCorrect && styles.letterTextCorrect,
                ]}
              >
                {option.letter}
              </Text>
            </View>

            <Text style={styles.optionText}>{option.text}</Text>

            <View
              style={[
                styles.selectionCircle,
                (isSelected || revealCorrect) && isAnswerChecked && isOptionCorrect && styles.selectionCircleCorrect,
                isSelected && isAnswerChecked && !isOptionCorrect && styles.selectionCircleWrong,
                isSelected && !isAnswerChecked && styles.selectionCircleSelected,
              ]}
            >
              {isSelected && !isAnswerChecked && (
                <Ionicons name="ellipse" size={10} color="#FFFFFF" />
              )}
              {(isSelected || revealCorrect) && isAnswerChecked && isOptionCorrect && (
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              )}
              {isSelected && isAnswerChecked && !isOptionCorrect && (
                <Ionicons name="close" size={14} color="#FFFFFF" />
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );

  const renderFeedback = () => {
    if (!isAnswerChecked) return null;
    if (!isCorrect) {
      return (
        <View style={[styles.feedbackCard, styles.feedbackCardWrong, Shadows.md]}>
          <View style={styles.feedbackHeaderRow}>
            <View style={[styles.leafIconCircle, styles.wrongIconCircle]}>
              <Ionicons name="close" size={20} color="#B91C1C" />
            </View>
            <View style={styles.feedbackTitleCol}>
              <Text style={styles.feedbackTitle}>Respuesta incorrecta</Text>
              <Text style={[styles.feedbackSubtitle, { color: '#B91C1C' }]}>Esta pregunta no suma puntos</Text>
            </View>
          </View>
          <Text style={styles.feedbackExplanation}>{question.feedback.explanation}</Text>
        </View>
      );
    }
    return (
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
    );
  };


  return (
    <View style={styles.screen}>
      {/* Header Fijo */}
      <View style={[styles.topHeader, { paddingTop: insets.top + Spacing.sm }]}>
        <View style={[styles.headerInnerContainer, (isDesktop || isTablet) && styles.containerCentered]}>
          <Pressable
            style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}
            onPress={goBack}
          >
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </Pressable>

          <View style={styles.streakPill}>
            <Ionicons name="flash" size={14} color="#D97706" />
            <Text style={styles.streakText}>{question.streakText}</Text>
          </View>

          <View style={styles.counterPill}>
            <Text style={styles.counterText}>
              {hasSubmitted ? 'Resultado' : `${question.questionNumber} / ${questions.length}`}
            </Text>
          </View>
        </View>
      </View>

      {/* Barra de Progreso Superior */}
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${((hasSubmitted ? questions.length : question.questionNumber - (isAnswerChecked ? 0 : 1)) / question.totalQuestions) * 100}%`,
            },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 120 + insets.bottom },
          (isDesktop || isTablet) && styles.containerCentered,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {hasSubmitted ? (
          <View style={[styles.feedbackCard, (isDesktop || isTablet) && styles.resultCardCentered, Shadows.md]}>
            <View style={styles.feedbackHeaderRow}>
              <View style={styles.leafIconCircle}>
                <MaterialCommunityIcons name="trophy-award" size={20} color="#1D7A46" />
              </View>
              <View style={styles.feedbackTitleCol}>
                <Text style={styles.feedbackTitle}>¡Evaluación completada!</Text>
                <Text style={styles.feedbackSubtitle}>
                  {correctAnswers} de {questions.length} respuestas correctas
                </Text>
              </View>
              <View style={styles.pointsPill}>
                <Text style={styles.pointsPillText}>{earnedPoints}</Text>
                <Text style={styles.pointsPillUnit}>pts</Text>
              </View>
            </View>
            <Text style={styles.feedbackExplanation}>
              Resultado: {totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0}%.
              {' '}Los puntos se guardaron en este dispositivo.
            </Text>
            <View style={styles.standardTag}>
              <MaterialCommunityIcons name="shield-check" size={14} color="#1D7A46" />
              <Text style={styles.standardTagText}>Puntaje máximo: {totalPoints} pts</Text>
            </View>
          </View>
        ) : isDesktop ? (
          <View style={styles.desktopQuizLayout}>
            {/* Columna Izquierda: Contexto, Pregunta e Imagen */}
            <View style={styles.desktopLeftCol}>
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

              <Text style={[styles.questionTitle, { fontSize: 26, lineHeight: 34 }]}>
                {question.title}
              </Text>

              <View style={[styles.imageCard, { height: 290 }, Shadows.md]}>
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
            </View>

            {/* Columna Derecha: Opciones y Feedback */}
            <View style={styles.desktopRightCol}>
              <Text style={styles.optionsPromptText}>Selecciona la alternativa correcta:</Text>
              {renderOptions()}
              {renderFeedback()}
            </View>
          </View>
        ) : (
          <View style={styles.mobileStackLayout}>
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
            <View style={[styles.imageCard, { height: isTablet ? 220 : 160 }, Shadows.md]}>
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

            {renderOptions()}
            {renderFeedback()}
          </View>
        )}
      </ScrollView>

      {/* Botón Inferior Fijo */}
      <View style={[styles.bottomBar, Shadows.lg, { paddingBottom: Spacing.md + insets.bottom }]}>
        <View style={styles.bottomBarInner}>
          {notice && (
            <Text style={styles.noticeText} accessibilityLiveRegion="polite">
              {notice}
            </Text>
          )}
          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>
              {hasSubmitted
                ? 'Volver a módulos'
                : !isAnswerChecked
                  ? 'Comprobar respuesta'
                  : questionIndex === questions.length - 1
                    ? 'Ver resultado'
                    : 'Siguiente pregunta'}
            </Text>
            <Ionicons
              name={hasSubmitted ? 'home-outline' : 'arrow-forward'}
              size={18}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
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
    flexWrap: 'wrap',
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
  optionCardSelected: {
    borderColor: Colors.primary,
  },
  centerState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.xl,
  },
  feedbackCardWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  wrongIconCircle: {
    backgroundColor: '#FEE2E2',
  },
  noticeText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
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
  selectionCircleWrong: {
    backgroundColor: '#B91C1C',
  },
  selectionCircleSelected: {
    backgroundColor: Colors.primary,
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
  headerInnerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerCentered: {
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
  },
  resultCardCentered: {
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
    marginVertical: Spacing.xl,
  },
  desktopQuizLayout: {
    flexDirection: 'row',
    gap: Spacing.xl,
    alignItems: 'flex-start',
    marginTop: Spacing.sm,
  },
  desktopLeftCol: {
    flex: 1.1,
    gap: Spacing.md,
  },
  desktopRightCol: {
    flex: 1.3,
    gap: Spacing.md,
  },
  optionsPromptText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  mobileStackLayout: {
    gap: Spacing.md,
  },
  bottomBarInner: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
});
