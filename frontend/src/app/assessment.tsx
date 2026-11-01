
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

type Question = {
  id: number;
  skill: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  difficulty: string;
};

export default function AssessmentScreen() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        'https://placement-analyzer-api-drmt.onrender.com/assessment-questions'
      );

      const data = await response.json();

      if (response.ok) {
        setQuestions(data.questions);
      } else {
        Alert.alert(
          'Error',
          'Could not load questions.'
        );
      }
    } catch (error) {
      Alert.alert(
        'Connection Error',
        'Could not connect to the backend.'
      );
    }
  };

  if (questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Loading assessment...
        </Text>
      </View>
    );
  }

  const question = questions[currentQuestion];

  const selectAnswer = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [question.id]: answer,
    });
  };
  const submitAssessment = async () => {
  try {
    const studentId = await AsyncStorage.getItem('student_id');

    if (!studentId) {
      Alert.alert(
        'Error',
        'Student ID not found. Please register first.'
      );
      return;
    }

    const response = await fetch(
      'https://placement-analyzer-api-drmt.onrender.com/complete-assessment',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: Number(studentId),
          answers: selectedAnswers,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
  await AsyncStorage.setItem(
    'assessment_results',
    JSON.stringify(data.results)
  );

  router.push('/results');

    } else {
      Alert.alert(
        'Submission Failed',
        JSON.stringify(data)
      );
    }

  } catch (error) {
    Alert.alert(
      'Connection Error',
      'Could not connect to the backend.'
    );
  }
};
  const nextQuestion = () => {

  // Check whether the current question has an answer
  if (!selectedAnswers[question.id]) {
    Alert.alert(
      'Select an Answer',
      'Please select an answer before continuing.'
    );
    return;
  }

  // Move to the next question
  if (currentQuestion < questions.length - 1) {
    setCurrentQuestion(currentQuestion + 1);
  } else {
    // Last question → submit assessment
    submitAssessment();
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>
        Skill Assessment
      </Text>

      <Text style={styles.progress}>
        Question {currentQuestion + 1} of {questions.length}
      </Text>

      <View style={styles.card}>

        <Text style={styles.skill}>
          {question.skill} • {question.difficulty}
        </Text>

        <Text style={styles.question}>
          {question.question}
        </Text>

        <TouchableOpacity
          style={[
            styles.option,
            selectedAnswers[question.id] === 'A' &&
              styles.selectedOption,
          ]}
          onPress={() => selectAnswer('A')}
        >
          <Text style={styles.optionText}>
            A. {question.options.A}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            selectedAnswers[question.id] === 'B' &&
              styles.selectedOption,
          ]}
          onPress={() => selectAnswer('B')}
        >
          <Text style={styles.optionText}>
            B. {question.options.B}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            selectedAnswers[question.id] === 'C' &&
              styles.selectedOption,
          ]}
          onPress={() => selectAnswer('C')}
        >
          <Text style={styles.optionText}>
            C. {question.options.C}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            selectedAnswers[question.id] === 'D' &&
              styles.selectedOption,
          ]}
          onPress={() => selectAnswer('D')}
        >
          <Text style={styles.optionText}>
            D. {question.options.D}
          </Text>
        </TouchableOpacity>

      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={nextQuestion}
      >
        <Text style={styles.nextButtonText}>
          {currentQuestion === questions.length - 1
            ? 'Finish'
            : 'Next'}
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#F5F7FB',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FB',
  },

  loadingText: {
    fontSize: 18,
    color: '#64748B',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 30,
  },

  progress: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
  },

  skill: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 15,
  },

  question: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1E293B',
    lineHeight: 28,
    marginBottom: 20,
  },

  option: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },

  selectedOption: {
    borderColor: '#2563EB',
    backgroundColor: '#DBEAFE',
  },

  optionText: {
    fontSize: 15,
    color: '#334155',
  },

  nextButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

