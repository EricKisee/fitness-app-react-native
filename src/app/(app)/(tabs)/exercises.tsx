import { Text, SafeAreaView, View, TextInput, TouchableOpacity, FlatList, RefreshControl } from 'react-native'
import React, { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { defineQuery } from 'groq'
import { client } from '@/lib/sanity/client'
import { Exercise } from '@/lib/sanity/types'
import ExerciseCard from '@/app/components/ExerciseCard'

export const exercisesQuery = defineQuery(`*[_type == "exercise" && isActive == true]{
  ...
}`)


export default function Exercises() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [refreshing, setRefreshing] = React.useState(false)
  const [exercises, setExercises] = React.useState<Exercise[]>([])
  const [filteredExercises, setFilteredExercises] = React.useState([])
  const router = useRouter()
  const fetchExercises = async () => {
    // Fetch exercises from Sanity or your backend
    try {
      const exercises = await client.fetch(exercisesQuery)
      setExercises(exercises)
      setFilteredExercises(exercises)
    } catch (error) {
      console.error('Error fetching exercises:', error)
    }
  }

  useEffect(()=> {
    fetchExercises()
  }, [])

  useEffect(() => {
    const filtered = exercises.filter((exercise:Exercise) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
    setFilteredExercises(filtered)
  }, [searchQuery, exercises])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchExercises()
    setRefreshing(false)
  }
  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='px-5 py-4 bg-white border-b border-gray-200'>
        <Text className='text-2xl font-bold text-gray-900'>Exercises Library</Text>
        <Text className='text-gray-600 mt-1'>
          Discover and Master New Exercises
        </Text>

        {/* Search bar */}
        <View className='flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mt-4'>
          <Ionicons name='search' size={20} color='#6B7280' />
          <TextInput 
            className='flex-1 ml-3 text-gray-800'
            placeholder='Search exercises...'
            placeholderTextColor='#9CA3AF'
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name='close-circle' size={20} color='#6B7280' />
            </TouchableOpacity>
          )

          }
        </View>
      </View>

      {/* Exercises List */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20}}
        renderItem={({item}) => (
          <ExerciseCard
            item={item}
            onPress={() => router.push(`/exercise-detail?id=${item.id}`)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']} //Android refresh indicator color
            tintColor='#3B82F6' //iOS refresh indicator color
            title='Pull to refresh exercises' //iOS refresh indicator title
          /> 
        }
        ListEmptyComponent={
          <View className='bg-white rounded-2xl p-8 items-center'>
            <Ionicons name='fitness-outline' size={64} color='#9CA3AF' />
            <Text className='text-gray-600 text-center mt-2'>
              {searchQuery 
                ? 'No exercises found matching your search.' 
                : 'No exercises available. Please add new exercises.'
              }
            </Text>
          </View>
        }
       />

    </SafeAreaView>
  )
}