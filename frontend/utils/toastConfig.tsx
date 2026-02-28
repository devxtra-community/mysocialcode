import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const toastConfig = {
  success: ({ text1 }: any) => (
    <View style={[styles.toast, styles.success]}>
      <Text style={styles.text}>{text1}</Text>
    </View>
  ),

  error: ({ text1 }: any) => (
    <View style={[styles.toast, styles.error]}>
      <Text style={styles.text}>{text1}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  success: {
    backgroundColor: '#22c55e',
  },
  error: {
    backgroundColor: '#ef4444',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
