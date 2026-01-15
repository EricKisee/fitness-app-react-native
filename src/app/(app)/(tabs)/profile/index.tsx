import { useAuth } from "@clerk/clerk-expo";
import React from "react";
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function ProfilePage() {

  const{signOut} = useAuth();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex flex-1">
      <Text>Profile</Text>
      
      {/* signout */}
      <View className='px-6 mb-8'>
        <TouchableOpacity
          onPress={handleSignOut}
          className='bg-red-600 rounded-2xl py-4 items-center mt-4 shadow-sm'
        >
          <Text className='text-white font-medium text-lg'>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
