
import React from 'react';
import { useRouter } from 'expo-router';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>
          Placement Analyzer
        </Text>

        <Text style={styles.subtitle}>
          Check your skills and placement readiness
        </Text>
      </View>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>
          Welcome 👋
        </Text>

        <Text style={styles.welcomeText}>
          Assess your technical skills, identify skill gaps,
          and improve your placement readiness.
        </Text>
      </View>

      {/* Start Assessment Button */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push('/assessment')}
      >
        <Text style={styles.buttonText}>
          Start Assessment
        </Text>
      </TouchableOpacity>

      {/* Register Student Button */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push('/register')}
      >
        <Text style={styles.secondaryButtonText}>
          Register Student
        </Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          What you can do
        </Text>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>
            📝 Skill Assessment
          </Text>

          <Text style={styles.featureText}>
            Test your Python, SQL, DSA, Statistics
            and Machine Learning skills.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>
            📊 Skill Analysis
          </Text>

          <Text style={styles.featureText}>
            Find out which skills are strong and
            which need improvement.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>
            🎯 Placement Readiness
          </Text>

          <Text style={styles.featureText}>
            Track your progress toward becoming
            placement ready.
          </Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#F5F7FB',
  },

  header: {
    marginTop: 40,
    marginBottom: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1E293B',
  },

  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
  },

  welcomeCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },

  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },

  welcomeText: {
    fontSize: 15,
    lineHeight: 23,
    color: '#64748B',
  },

  primaryButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  secondaryButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2563EB',
  },

  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: 'bold',
  },

  section: {
    marginTop: 30,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 14,
  },

  featureCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
  },

  featureTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 6,
  },

  featureText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#64748B',
  },
});

