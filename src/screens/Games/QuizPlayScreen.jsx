import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

/* ─────────────── QUIZ DATA ─────────────── */

const QUIZ_DATA = {
  phishing: [
    {
      question: 'You receive an SMS from your bank claiming your account is blocked, with a link to verify. What is the safest action?',
      options: [
        'Click the link and fill out your banking details',
        'Reply to the SMS asking for more information',
        'Delete the SMS and call your bank\'s official helpline',
        'Ignore the SMS and wait for them to send a letter',
      ],
      correctIndex: 2,
      explanation: 'Real banks will never ask you to verify sensitive account information or passwords via a link sent in an SMS.',
    },
    {
      question: 'Which of the following email sender addresses is most likely a phishing attempt?',
      options: [
        'billing-alert@netfl1x-security.net',
        'no-reply@mail.netflix.com',
        'support@netflix.com',
        'info@accounts.netflix.com',
      ],
      correctIndex: 0,
      explanation: 'Phishers use domain impersonation (look-alike domains like "netfl1x" instead of "netflix") to deceive targets.',
    },
    {
      question: 'What is the primary indicator of a "smishing" scam?',
      options: [
        'A fake video call from your employer',
        'A suspicious link sent via SMS/Text Message',
        'An automated phone recording from the IRS',
        'A popup banner on a shopping website',
      ],
      correctIndex: 1,
      explanation: 'Smishing stands for SMS Phishing — phishing attacks carried out specifically through text messages.',
    },
    {
      question: 'An email congratulates you on winning a raffle you never entered, asking for a small processing fee. What is this?',
      options: [
        'A legitimate prize notification',
        'An advance-fee lottery scam',
        'A standard marketing survey',
        'A Google system notification error',
      ],
      correctIndex: 1,
      explanation: 'If you have to pay a fee to claim a prize you supposedly "won" in a contest you never entered, it is always a scam.',
    },
  ],
  voice: [
    {
      question: 'Your grandchild calls crying that they were arrested and need money immediately. How do you verify this?',
      options: [
        'Transfer the money ASAP via wire transfer',
        'Hang up and call your grandchild directly on their normal number',
        'Ask them to send a photo of the police station',
        'Call the number they are currently calling from',
      ],
      correctIndex: 1,
      explanation: 'AI voice cloning can replicate anyone\'s voice with a short audio sample. Always double-verify by calling their primary number.',
    },
    {
      question: 'How much audio does an AI model need to clone someone\'s voice realistically?',
      options: [
        'At least 2 hours of high-quality recording',
        'Around 15 to 30 seconds of clear audio',
        'At least 5 minutes of continuous conversation',
        'No audio, it can be generated from text alone',
      ],
      correctIndex: 1,
      explanation: 'Modern AI voice cloning tools can replicate a voice with high accuracy using only a short 15–30 second snippet.',
    },
    {
      question: 'You receive a voice note from your boss asking you to buy gift cards for a client immediately. What should you do?',
      options: [
        'Purchase the cards and text the codes',
        'Forward the voice note request to HR',
        'Call your boss directly on their phone to confirm',
        'Ignore the message and do nothing',
      ],
      correctIndex: 2,
      explanation: 'Impersonation using cloned voice notes is a common business compromise tactic. Always verify via a direct phone call.',
    },
    {
      question: 'What is the best way to protect your family from voice cloning emergency scams?',
      options: [
        'Never speak to anyone on the phone',
        'Establish a secret family safe-word passcode',
        'Block all unknown phone numbers',
        'Delete all social media accounts',
      ],
      correctIndex: 1,
      explanation: 'A pre-established, offline family safe word or passcode is a highly effective way to confirm identity in emergency calls.',
    },
  ],
  deepfake: [
    {
      question: 'A video shows a famous politician endorsing a cryptocurrency investment. How can you spot if it is a deepfake?',
      options: [
        'Watch for unnatural eye blinking and mouth sync issues',
        'Check if the video resolution is high definition',
        'Look for the politician\'s official digital signature',
        'Assume it is real if it is posted on Twitter',
      ],
      correctIndex: 0,
      explanation: 'Common signs of deepfakes include unnatural blinking, lips out of sync with speech, and blurring around the mouth/eyes.',
    },
    {
      question: 'You see a video of a celebrity promoting a massive product giveaway. What is the safest assumption?',
      options: [
        'It is a real giveaway endorsed by the celebrity',
        'It is likely an AI deepfake promoting a scam',
        'It is a CGI scene from an upcoming movie',
        'It is a fan-made tribute video',
      ],
      correctIndex: 1,
      explanation: 'Celebrities rarely host giveaways asking users to send crypto or register credit cards. These are almost always deepfakes.',
    },
    {
      question: 'What does the term "deepfake" refer to?',
      options: [
        'A high-definition digital rendering technique',
        'AI-manipulated media replacing one person\'s face or voice with another\'s',
        'A virtual reality environment',
        'An encrypted database record',
      ],
      correctIndex: 1,
      explanation: 'Deepfakes are synthetic media in which a person\'s face, body, or voice is digitally altered to look like someone else.',
    },
    {
      question: 'How do hackers use real-time deepfakes in corporate scams?',
      options: [
        'To write malicious software programs',
        'To impersonate executives on video conferences',
        'To corrupt database structures',
        'To trigger denial-of-service attacks',
      ],
      correctIndex: 1,
      explanation: 'Scammers have held video conferences using real-time deepfakes of CEOs to authorize massive financial transfers.',
    },
  ],
  jobs: [
    {
      question: 'You are offered a remote job on WhatsApp paying $500/day for liking videos, but must pay a training fee. What is this?',
      options: [
        'A standard corporate training expense',
        'A task-based prepayment recruitment scam',
        'A high-paying internship opportunity',
        'A freelance referral program',
      ],
      correctIndex: 1,
      explanation: 'Legitimate employers will never ask you to pay money to start working or for equipment/training up-front.',
    },
    {
      question: 'An online broker promises "guaranteed 100% daily returns" on crypto with zero risk. Is this possible?',
      options: [
        'Yes, using advanced AI trading bots',
        'No, guaranteed high returns are always a scam signal',
        'Yes, if they are certified by the government',
        'Yes, if you invest a large amount of money',
      ],
      correctIndex: 1,
      explanation: 'There is no such thing as a risk-free investment with guaranteed high returns. This is the hallmark of a Ponzi scam.',
    },
    {
      question: 'You get a text saying a package delivery failed and you must pay $1.50 to reschedule. What is this?',
      options: [
        'A shipping fee error',
        'A phishing link targeting credit cards',
        'An official postal notification',
        'A delivery driver update',
      ],
      correctIndex: 1,
      explanation: 'Delivery failure texts with payment links are a common smishing scam designed to harvest credit card details.',
    },
    {
      question: 'A stranger on social media initiates romance and quickly asks for crypto to help a sick relative. What is this?',
      options: [
        'A charity outreach program',
        'A romance/pig-butchering scam',
        'A mutual aid agreement',
        'A personal finance request',
      ],
      correctIndex: 1,
      explanation: 'Romance scams involve building fake emotional bonds online to manipulate victims into sending money or crypto.',
    },
  ],
  social: [
    {
      question: 'A support representative calls claiming they detected malware on your PC and asks for remote access. What do you do?',
      options: [
        'Grant remote access and let them fix it',
        'Provide your credit card details for the software fee',
        'Hang up and contact your antivirus company directly',
        'Give them your password to verify your account',
      ],
      correctIndex: 2,
      explanation: 'Tech support scammers call out of the blue, fabricate technical issues, and demand remote access to steal your information.',
    },
  ],
};

const OPTION_PREFIXES = ['A', 'B', 'C', 'D'];
const TIME_LIMIT = 25;

/* ─────────────── SCREEN ─────────────── */

export default function QuizPlayScreen({ route, navigation }) {
  const categoryId = route?.params?.categoryId || 'phishing';

  const questions = useMemo(() => {
    return QUIZ_DATA[categoryId] || QUIZ_DATA.phishing;
  }, [categoryId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Lifelines
  const [used5050, setUsed5050] = useState(false);
  const [usedAudience, setUsedAudience] = useState(false);
  const [usedAddTime, setUsedAddTime] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [audiencePercentages, setAudiencePercentages] = useState([]);
  const [showAudience, setShowAudience] = useState(false);

  // Scores
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Timer
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const timerRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(1)).current;

  const question = questions[currentIndex];

  const handleTimeOut = useCallback(() => {
    if (submitted) {
      return;
    }
    setSubmitted(true);
    setWrongCount((w) => w + 1);
    Alert.alert('⏰ Time Up!', 'You ran out of time for this question.', [{ text: 'OK' }]);
  }, [submitted]);

  useEffect(() => {
    setTimeLeft(TIME_LIMIT);
    progressAnim.setValue(1);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIndex, handleTimeOut, progressAnim]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: timeLeft / (usedAddTime ? TIME_LIMIT + 15 : TIME_LIMIT),
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [timeLeft, progressAnim, usedAddTime]);

  const handleSelectOption = (idx) => {
    if (submitted) {
      return;
    }
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null || submitted) {
      return;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setSubmitted(true);
    if (selected === question.correctIndex) {
      setCorrectCount((c) => c + 1);
    } else {
      setWrongCount((w) => w + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      navigation.replace('QuizResult', {
        total: questions.length,
        correct: correctCount,
        wrong: wrongCount,
        xpEarned: correctCount * 10,
      });
      return;
    }
    setSelected(null);
    setSubmitted(false);
    setHiddenOptions([]);
    setShowAudience(false);
    setCurrentIndex((i) => i + 1);
  };

  const handle5050 = () => {
    if (used5050 || submitted) {
      return;
    }
    setUsed5050(true);
    const wrongIndices = [];
    question.options.forEach((_, idx) => {
      if (idx !== question.correctIndex) {
        wrongIndices.push(idx);
      }
    });
    const toHide = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
    setHiddenOptions(toHide);
  };

  const handleAudience = () => {
    if (usedAudience || submitted) {
      return;
    }
    setUsedAudience(true);
    const percentages = [10, 10, 10, 10];
    percentages[question.correctIndex] = 70;
    let remainder = 30;
    question.options.forEach((_, idx) => {
      if (idx !== question.correctIndex) {
        const share = Math.floor(Math.random() * (remainder - 5)) + 2;
        percentages[idx] = share;
        remainder -= share;
      }
    });
    question.options.forEach((_, idx) => {
      if (idx !== question.correctIndex && remainder > 0) {
        percentages[idx] += remainder;
        remainder = 0;
      }
    });
    setAudiencePercentages(percentages);
    setShowAudience(true);
  };

  const handleAddTime = () => {
    if (usedAddTime || submitted) {
      return;
    }
    setUsedAddTime(true);
    setTimeLeft((prev) => prev + 15);
  };

  const handleSkip = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (currentIndex === questions.length - 1) {
      navigation.replace('QuizResult', {
        total: questions.length,
        correct: correctCount,
        wrong: wrongCount,
        xpEarned: correctCount * 10,
      });
      return;
    }
    setSelected(null);
    setSubmitted(false);
    setHiddenOptions([]);
    setShowAudience(false);
    setCurrentIndex((i) => i + 1);
  };

  const renderOption = (opt, idx) => {
    if (hiddenOptions.includes(idx)) {
      return null;
    }

    const isSelected = selected === idx;
    const isCorrect = submitted && idx === question.correctIndex;
    const isWrong = submitted && isSelected && idx !== question.correctIndex;

    let cardStyle = styles.optionCard;
    let badgeStyle = styles.optionBadge;
    let badgeTextStyle = styles.optionBadgeText;
    let feedbackIcon = null;

    if (isCorrect) {
      cardStyle = [styles.optionCard, styles.optionCorrect];
      badgeStyle = [styles.optionBadge, styles.badgeCorrect];
      badgeTextStyle = [styles.optionBadgeText, styles.badgeTextLight];
      feedbackIcon = <Ionicons name="checkmark-circle" size={20} color="#059669" />;
    } else if (isWrong) {
      cardStyle = [styles.optionCard, styles.optionWrong];
      badgeStyle = [styles.optionBadge, styles.badgeWrong];
      badgeTextStyle = [styles.optionBadgeText, styles.badgeTextLight];
      feedbackIcon = <Ionicons name="close-circle" size={20} color="#DC2626" />;
    } else if (isSelected) {
      cardStyle = [styles.optionCard, styles.optionSelected];
      badgeStyle = [styles.optionBadge, styles.badgeSelected];
      badgeTextStyle = [styles.optionBadgeText, styles.badgeTextLight];
    }

    return (
      <TouchableOpacity
        key={idx}
        disabled={submitted}
        activeOpacity={0.8}
        onPress={() => handleSelectOption(idx)}
        style={cardStyle}
      >
        <View style={styles.optionInner}>
          <View style={badgeStyle}>
            <Text style={badgeTextStyle}>{OPTION_PREFIXES[idx]}</Text>
          </View>
          <Text style={styles.optionText}>{opt}</Text>
        </View>

        <View style={styles.optionRight}>
          {showAudience && (
            <Text style={styles.audiencePct}>{audiencePercentages[idx]}%</Text>
          )}
          {feedbackIcon}
        </View>
      </TouchableOpacity>
    );
  };

  const formattedTime = () => {
    const sec = timeLeft % 60;
    return `00:${sec < 10 ? '0' : ''}${sec}`;
  };

  const timerColor = timeLeft <= 8 ? '#DC2626' : '#0056D2';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── CLEAN TOP HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Question {currentIndex + 1} of {questions.length}</Text>
        </View>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setIsBookmarked(!isBookmarked)}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={isBookmarked ? '#D97706' : '#64748B'}
          />
        </TouchableOpacity>
      </View>

      {/* ── PROGRESS TRACK ── */}
      <View style={styles.progressRow}>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${((currentIndex + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── QUESTION CARD ── */}
        <View style={styles.questionCard}>
          <View style={styles.questionTagRow}>
            <Ionicons name="shield-checkmark" size={16} color="#0056D2" />
            <Text style={styles.questionTagText}>SCAM AWARENESS DRILL</Text>
          </View>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        {/* ── TIMER ── */}
        <View style={styles.timerRow}>
          <Ionicons name="time-outline" size={16} color={timerColor} />
          <View style={styles.timerTrack}>
            <Animated.View
              style={[
                styles.timerFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: timerColor,
                },
              ]}
            />
          </View>
          <Text style={[styles.timerText, { color: timerColor }]}>{formattedTime()}</Text>
        </View>

        {/* ── OPTIONS ── */}
        <View style={styles.optionsList}>
          {question.options.map((opt, idx) => renderOption(opt, idx))}
        </View>

        {/* ── EXPLANATION CARD ── */}
        {submitted && (
          <View style={styles.explanationCard}>
            <View style={styles.explanationHeader}>
              <View style={styles.explanationIconBox}>
                <Ionicons name="bulb-outline" size={16} color="#0056D2" />
              </View>
              <Text style={styles.explanationTitle}>Security Tip</Text>
            </View>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}

        {/* ── ACTION BUTTON ── */}
        {!submitted ? (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleSubmit}
            disabled={selected === null}
          >
            <LinearGradient
              colors={selected !== null ? ['#0056D2', '#0284C7'] : ['#CBD5E1', '#CBD5E1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionBtn}
            >
              <Text style={styles.actionBtnText}>Submit Answer</Text>
              {selected !== null && (
                <Ionicons name="checkmark" size={18} color="#FFF" style={styles.actionBtnIcon} />
              )}
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity activeOpacity={0.88} onPress={handleNext}>
            <LinearGradient
              colors={['#0056D2', '#0284C7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionBtn}
            >
              <Text style={styles.actionBtnText}>
                {currentIndex === questions.length - 1 ? 'View Quiz Results 🎉' : 'Next Question →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* ── LIFELINES ── */}
        {!submitted && (
          <View style={styles.lifelinesRow}>
            {[
              { label: '50/50', icon: 'git-compare-outline', used: used5050, onPress: handle5050 },
              { label: 'Audience', icon: 'people-outline', used: usedAudience, onPress: handleAudience },
              { label: '+15s', icon: 'timer-outline', used: usedAddTime, onPress: handleAddTime },
              { label: 'Skip', icon: 'play-skip-forward-outline', used: false, onPress: handleSkip },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.lifelineBtn, item.used && styles.lifelineBtnUsed]}
                onPress={item.onPress}
                disabled={item.used}
              >
                <Ionicons
                  name={item.icon}
                  size={16}
                  color={item.used ? '#94A3B8' : '#0056D2'}
                />
                <Text style={[styles.lifelineLabel, item.used && styles.lifelineLabelUsed]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─────────────── STYLES ─────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },

  /* PROGRESS BAR */
  progressRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0056D2',
    borderRadius: 3,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },

  /* QUESTION CARD */
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  questionTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  questionTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0056D2',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 24,
  },

  /* TIMER */
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  timerTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    borderRadius: 3,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '800',
    minWidth: 36,
    textAlign: 'right',
  },

  /* OPTIONS */
  optionsList: {
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  optionSelected: {
    backgroundColor: '#F0F9FF',
    borderColor: '#0056D2',
  },
  optionCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  optionWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#DC2626',
  },
  optionInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  optionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeSelected: {
    backgroundColor: '#0056D2',
  },
  badgeCorrect: {
    backgroundColor: '#059669',
  },
  badgeWrong: {
    backgroundColor: '#DC2626',
  },
  optionBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  badgeTextLight: {
    color: '#FFFFFF',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    lineHeight: 20,
  },
  audiencePct: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },

  /* EXPLANATION */
  explanationCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  explanationIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  explanationTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E40AF',
  },
  explanationText: {
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 19,
    fontWeight: '600',
  },

  /* ACTION BUTTON */
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#0056D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionBtnIcon: {
    marginLeft: 8,
  },

  /* LIFELINES */
  lifelinesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  lifelineBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  lifelineBtnUsed: {
    backgroundColor: '#F8FAFC',
    borderColor: '#F1F5F9',
  },
  lifelineLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0056D2',
  },
  lifelineLabelUsed: {
    color: '#94A3B8',
  },

  bottomSpacer: {
    height: 20,
  },
});
