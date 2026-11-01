
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '../api';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [projects, setProjects] = useState('');
  const [internships, setInternships] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const registerStudent = async () => {
    if (!name || !branch || !cgpa || !projects || !internships) {
      Alert.alert(
        'Missing Information',
        'Please fill all fields.'
      );
      return;
    }

    setIsRegistering(true);

    try {
      const response = await fetch(
        `${API_URL}/students`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            branch,
            cgpa: Number(cgpa),
            projects: Number(projects),
            internships: Number(internships),
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        const studentId = data.student_id;
        if (studentId === undefined || studentId === null) {
          Alert.alert(
            'Registration Failed',
            'The backend did not return a student ID. Please try again.'
          );
          return;
        }

        await AsyncStorage.setItem('student_id', String(studentId));
        Alert.alert('Registration Successful', `Student ID: ${studentId}`);

        setName('');
        setBranch('');
        setCgpa('');
        setProjects('');
        setInternships('');
      } else {
        Alert.alert(
          'Registration Failed',
          data.detail || data.message || 'Please check your information and try again.'
        );
      }
    } catch (error) {
      Alert.alert(
        'Connection Error',
        'Could not connect to the backend.'
      );
    } finally {
      setIsRegistering(false);
    }
  };

  return (
   <KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  <ScrollView
    contentContainerStyle={styles.container}
    keyboardShouldPersistTaps="handled"
  >
      <Text style={styles.title}>
        Student Registration
      </Text>

      <Text style={styles.label}>
        Name
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>
        Branch
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Example: Data Science"
        value={branch}
        onChangeText={setBranch}
      />

      <Text style={styles.label}>
        CGPA
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Example: 8.2"
        keyboardType="decimal-pad"
        value={cgpa}
        onChangeText={setCgpa}
      />

      <Text style={styles.label}>
        Projects
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Number of projects"
        keyboardType="numeric"
        value={projects}
        onChangeText={setProjects}
      />

      <Text style={styles.label}>
        Internships
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Number of internships"
        keyboardType="numeric"
        value={internships}
        onChangeText={setInternships}
      />

      <TouchableOpacity
        style={[styles.button, isRegistering && styles.disabledButton]}
        onPress={registerStudent}
        disabled={isRegistering}
      >
        <Text style={styles.buttonText}>
          {isRegistering ? 'Registering...' : 'Register Student'}
        </Text>
      </TouchableOpacity>

    </ScrollView>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#F5F7FB',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 40,
    marginBottom: 30,
  },

  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 6,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 18,
  },

  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
