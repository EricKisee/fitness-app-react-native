import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

export default function ExerciseDetail() {
    const {id} = useLocalSearchParams<{id: string}>()
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Text>ExerciseDetail with ID: {id}</Text>
    </SafeAreaView >
  )
}