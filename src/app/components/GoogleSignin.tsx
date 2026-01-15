import React, { useCallback, useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { useSSO } from '@clerk/clerk-expo'
import { View, TouchableOpacity, Text } from 'react-native'
import { Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';


export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS === "android") {
      // ✅ Only available on Android
      void WebBrowser.warmUpAsync();

      return () => {
        void WebBrowser.coolDownAsync();
      };
    }

    if (Platform.OS === "ios") {
      // iOS doesn’t support warmUpAsync/coolDownAsync, but you could add other logic here if needed
      console.log("useWarmUpBrowser: running on iOS");
    }

    if (Platform.OS === "web") {
      // Web doesn’t support warmUpAsync/coolDownAsync
      console.log("useWarmUpBrowser: running on Web");
    }
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

export default function GoogleSignin() {
  useWarmUpBrowser()

  const router = useRouter()

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO()

  const onPress = useCallback(async () => {
  try {
    const { createdSessionId, setActive } = await startSSOFlow({
      strategy: 'oauth_google',
      redirectUrl: AuthSession.makeRedirectUri(),
    });

    if (createdSessionId && setActive) {
      await setActive({ session: createdSessionId });
      router.replace('/'); // or '/(tabs)'
    }
  } catch (err) {
    console.error('Google SSO error:', err);
  }
}, [router]);


return (
    <TouchableOpacity 
    onPress={onPress} 
    className='bg-white border-2 border-gray-200 rounded-xl py-4 shadow-sm'>
        <View className='flex-row items-center justify-center'>
            <Ionicons name='logo-google' size={20} color='#EA4335' />
            <Text className='text-gray-900 font-semibold ml-3 text-lg'>Sign in with Google</Text>
        </View>
    </TouchableOpacity>
  )
}