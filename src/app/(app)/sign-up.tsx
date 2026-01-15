import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function SignUpScreen() {
  const [isLoading, setIsLoading] = React.useState(false)
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return
    if(!emailAddress || !password) {
      Alert.alert('Please fill in both email and password to sign in.')
      return
    }
    setIsLoading(true)

    console.log(emailAddress, password)

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      // todo: refactor to a separate component
      //  todo: add resend code functionality
      <SafeAreaView className='flex-1 bg-gray-50'>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='flex-1'>
          <View className='flex-1 px-6' >
            <View className='flex-1 justify-center items-center'>
              <View className='items-center mb-8'>
              {/* logo/branding */}
                <View className='w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg'>
                  <Ionicons name='mail' size={40} color='white' />
                </View>
                <Text className='text-3xl font-bold text-gray-900 mb-2'>
                  Verify Your Email
                </Text>
                <Text className='text-l text-gray-600 text-center'>
                  A verification code has been sent to {'\n'}{emailAddress}. Please enter it below.
                </Text>

                <View className='mb-6 items-center'>
                  <Text className='text-sm font-medium text-gray-700 mb-2 mt-2'>Verification Code</Text>
                <View className="flex-row items-center w-full">
                  <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                    <Ionicons name='key-outline' size={20} color='#6B7280' />
                    <TextInput 
                      value={code}
                      placeholder="Enter verification code"
                      placeholderTextColor="#9CA3AF"
                      onChangeText={setCode}
                      className='ml-3 flex-1 text-gray-900 text-center text-lg tracking-widest'
                      keyboardType="number-pad"
                      maxLength={6}
                      editable={!isLoading}
                    />
                  </View>
                </View>
                </View>

                <TouchableOpacity
                  onPress={onVerifyPress}
                  disabled={isLoading}
                  className={`rounded-xl shadow-sm mb-4 py-4 px-6 items-center ${isLoading ? 'bg-gray-400' : 'bg-blue-600'}`} activeOpacity={0.8}
                >
                  <View className='flex-row items-center justify-center'>
                    {isLoading ? (
                      <Ionicons name='refresh' size={20} color='white' className='mr-2 animate-spin' />
                    ) : (
                      <Ionicons name='checkmark-circle-outline' size={20} color='white' className='mr-2' />
                    )} 
                    <Text className='text-white font-semibold text-lg ml-2'>
                      {isLoading ? 'Verifying...' : 'Verify'}
                    </Text>
                  </View>
                </TouchableOpacity>
                {/* Resend verification code */}
                <TouchableOpacity disabled={isLoading}>
                  <Text className='text-medium text-blue-600 text-center'>
                    Didn't receive the code? Resend Code
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='flex-1'>
        <View className='flex-1 px-6'>
          <View className='flex-1 justify-center'>
            {/* logo/branding */}
            <View className='items-center mb-8'>
              <View className='w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg'>
                <Ionicons name='fitness' size={40} color='white' />
              </View>
              <Text className='text-3xl font-bold text-gray-900 mb-2'>
                Join FitTracker
              </Text>
              <Text className='text-l text-gray-600 text-center'>
                Track your fitness journey with ease {'\n'}and reach your goals!
              </Text>
            </View>
            <View  className='bg-white rounded-2xl p-6 shaddow-sm border border-gray-100 mb-6'>
              <Text className='text-2xl font-bold text-gray-900 mb-6 text-center'>
                Create Your Yccount
              </Text>
              <View className='mb-4'>
                <Text className='text-sm font-medium text-gray-700 mb-2'>Email Address</Text>
                <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                  <Ionicons name='mail-outline' size={20} color='#6B7280' />
                  <TextInput 
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    placeholderTextColor="#9CA3AF"
                    onChangeText={setEmailAddress}
                    className='ml-3 flex-1 text-gray-900'
                    editable={!isLoading}
                  />
                </View>
              </View>
              <View className='mb-6'>
                <Text className='text-sm font-medium text-gray-700 mb-2'>Password</Text>
                <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                  <Ionicons name='lock-closed-outline' size={20} color='#6B7280' />
                  <TextInput
                    value={password}
                    placeholder="Enter password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    className='ml-3 flex-1 text-gray-900'
                    editable={!isLoading}
                  />
                </View>
                <Text className='text-xs text-gray-500 mt-1'>
                  Must be at least 8 characters.
                </Text>
              </View>
              {/* signup button */}
              <TouchableOpacity
                onPress={onSignUpPress}
                disabled={isLoading}
                className={`rounded-xl shadow-sm mb-4 py-4 items-center ${isLoading ? 'bg-gray-400' : 'bg-blue-600'}`} activeOpacity={0.8}
              >

                <View className='flex-row items-center justify-center'>
                  {isLoading ? (
                    <Ionicons key="loading" name='refresh' size={20} color='white' className='mr-2 animate-spin' />
                  ) : (
                    <Ionicons key="idle" name='person-add-outline' size={20} color='white' className='mr-2' />
                  )} 
                  <Text className='text-white font-semibold text-lg ml-2'>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </View>

              </TouchableOpacity>

              <Text className='text-center text-xs text-gray-500 mb-4'>
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </Text>
            </View>

            <View className='flex-row justify-center items-center'>
              <Text className='text-sm text-gray-600'>Already have an account? </Text>
              <Link href="/sign-in" asChild>
                  <TouchableOpacity>
                    <Text className='text-sm text-blue-600 font-semibold'>Sign in</Text>
                  </TouchableOpacity>
              </Link>
            </View>
          </View>
            {/* footer */}
            <View className='pb-6'>
              <Text className='text-xs text-gray-500 text-center'>
                © 2026 FitTracker. All rights reserved.
              </Text>
            </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}