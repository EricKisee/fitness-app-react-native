import { Text, SafeAreaView, View, TextInput, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function Exercises() {
  const [searchQuery, setSearchQuery] = React.useState('')
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
    </SafeAreaView>
  )
}