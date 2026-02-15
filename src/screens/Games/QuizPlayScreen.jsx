import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = Math.min(Math.round(width * 0.5), 220);

/* ---------------- CATEGORY VISUALS (ROTATING, NO REPEAT) ---------------- */

const CATEGORY_VISUALS = {
  phishing: [
    'https://i.imgur.com/8Km9tLL.png', // fake bank email
    'https://i.imgur.com/Q9BGTuy.png', // suspicious login page
    'https://i.imgur.com/3ZQ3Z2C.png', // phishing warning example
    'https://i.imgur.com/1q9Z1Zm.png', // email link hover
    'https://i.imgur.com/5T4H8mN.png', // fake delivery SMS
  ],

  voice: [
    'https://i.imgur.com/DvpvklR.png', // phone scam call
    'https://i.imgur.com/1mWZQ7J.png', // voice message UI
    'https://i.imgur.com/5FQ9k9T.png', // call urgency
    'https://i.imgur.com/WZk6x9y.png', // AI voice waveform
    'https://i.imgur.com/YX5Gm6R.png', // unknown caller alert
  ],

  deepfake: [
    'https://i.imgur.com/6n8Q3XW.png', // deepfake face
    'https://i.imgur.com/9YjX9mP.png', // manipulated video
    'https://i.imgur.com/4N8L7hK.png', // face distortion
    'https://i.imgur.com/2ZLJ4YB.png', // fake celebrity video
    'https://i.imgur.com/FQ7dR8J.png', // AI generated face
  ],

  jobs: [
    'https://i.imgur.com/3G8mZ2r.png', // fake job offer
    'https://i.imgur.com/8R9pZ6Y.png', // crypto scam chat
    'https://i.imgur.com/F6kHqYb.png', // payment request
    'https://i.imgur.com/mT6QZ9A.png', // fake recruiter email
    'https://i.imgur.com/Zk9P2V7.png', // guaranteed returns scam
  ],

  social: [
    'https://i.imgur.com/7V7K1d0.png', // sympathy scam
    'https://i.imgur.com/2LZ8w4Q.png', // fake profile
    'https://i.imgur.com/J6YF3dP.png', // impersonation chat
    'https://i.imgur.com/8XGZ1rT.png', // authority scam
    'https://i.imgur.com/kQ4R8xP.png', // urgent money request
  ],
};

/* ---------------- QUIZ DATA (SHORT + EDUCATIONAL) ---------------- */

const QUIZ_DATA = {
  phishing: [
    {
      question: 'Bank email says your account is locked. Best action?',
      options: [
        'Click the link',
        'Verify via official bank app or number',
        'Reply asking details',
        'Forward to others',
      ],
      correctIndex: 1,
      explanation: 'Always verify through official channels.',
    },
    {
      question: 'Which URL looks suspicious?',
      options: [
        'https://bank.com',
        'https://bank-secure-login.net',
        'https://google.com',
        'https://github.com',
      ],
      correctIndex: 1,
      explanation: 'Scammers use look-alike domains.',
    },
    {
      question: 'Urgent messages usually indicate?',
      options: ['Normal alert', 'Scam tactic', 'Marketing', 'Reminder'],
      correctIndex: 1,
      explanation: 'Urgency pressures victims to act fast.',
    },
    {
      question: 'Smishing refers to scams via?',
      options: ['Email', 'SMS', 'Calls', 'Forums'],
      correctIndex: 1,
      explanation: 'Smishing = SMS phishing.',
    },
    {
      question: 'Common phishing sign?',
      options: [
        'Wrong sender domain',
        'Professional tone',
        'Official logo',
        'Verified email',
      ],
      correctIndex: 0,
      explanation: 'Sender/domain mismatch is a red flag.',
    },
  ],
};

/* ---------------- SAFE IMAGE RESOLVER ---------------- */

const getQuestionImage = (categoryId, index) => {
  const visuals = CATEGORY_VISUALS[categoryId];
  if (!visuals || visuals.length === 0) return null;
  return visuals[index % visuals.length];
};

/* ---------------- SCREEN ---------------- */

export default function QuizPlayScreen({ route, navigation }) {
  const categoryId = route?.params?.categoryId || 'phishing';
  const title = route?.params?.title || 'Scam Quiz';

  // SAFE QUESTIONS (CRITICAL FIX)
  const questions = useMemo(() => {
    return QUIZ_DATA[categoryId] || QUIZ_DATA.phishing;
  }, [categoryId]);

  // SAFETY GUARD (PREVENTS HERMES CRASH)
  if (!questions || questions.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading quiz…</Text>
      </SafeAreaView>
    );
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const question = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;

  const handleSubmit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);

    if (selected === question.correctIndex) {
      setCorrectCount(c => c + 1);
    } else {
      setWrongCount(w => w + 1);
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
    setCurrentIndex(i => i + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#2563EB" />
          </TouchableOpacity>

          <Text style={styles.title}>{title}</Text>

          <Text style={styles.counter}>
            {currentIndex + 1}/{questions.length}
          </Text>
        </View>

        {/* PROGRESS */}
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>

        {/* IMAGE */}
        {getQuestionImage(categoryId, currentIndex) && (
          <Image
            source={{ uri: getQuestionImage(categoryId, currentIndex) }}
            style={styles.image}
          />
        )}

        {/* QUESTION */}
        <View style={styles.card}>
          <Text style={styles.question}>{question.question}</Text>
        </View>

        {/* OPTIONS */}
        {question.options.map((opt, idx) => {
          const isCorrect = submitted && idx === question.correctIndex;
          const isWrong =
            submitted && selected === idx && idx !== question.correctIndex;

          return (
            <TouchableOpacity
              key={idx}
              disabled={submitted}
              onPress={() => setSelected(idx)}
              style={[
                styles.option,
                selected === idx && !submitted && styles.optionSelected,
                isCorrect && styles.optionCorrect,
                isWrong && styles.optionWrong,
              ]}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}

        {/* EXPLANATION */}
        {submitted && (
          <View style={styles.explainBox}>
            <Text style={styles.explainText}>
              {question.explanation}
            </Text>
          </View>
        )}

        {/* ACTION BUTTON */}
        {!submitted ? (
          <TouchableOpacity
            style={[
              styles.btn,
              selected === null && { opacity: 0.4 },
            ]}
            disabled={selected === null}
            onPress={handleSubmit}
          >
            <Text style={styles.btnText}>Submit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btn} onPress={handleNext}>
            <Text style={styles.btnText}>
              {currentIndex === questions.length - 1
                ? 'Finish Quiz'
                : 'Next'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFF',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontWeight: '900',
    fontSize: 16,
    color: '#0F172A',
  },
  counter: {
    fontWeight: '700',
    color: '#2563EB',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5EDFF',
    borderRadius: 8,
    marginBottom: 14,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    borderRadius: 16,
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  question: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  option: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5EDFF',
  },
  optionSelected: {
    backgroundColor: '#EEF4FF',
    borderColor: '#2563EB',
  },
  optionCorrect: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  optionWrong: {
    backgroundColor: '#FECACA',
    borderColor: '#EF4444',
  },
  optionText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  explainBox: {
    backgroundColor: '#EEF4FF',
    padding: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  explainText: {
    color: '#334155',
    fontSize: 13,
  },
  btn: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  btnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
  },
});