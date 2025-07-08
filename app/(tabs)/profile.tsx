import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { MaterialIcons, Feather, Ionicons, AntDesign } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  // Mock user data
  const user = {
    name: 'Marcelo Rodrigo',
    email: 'mage.rodrigo.swu@phinmaed.com',
    phone: '09319887714',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    joinDate: 'Joined January 2023',
  };

  const showLogoutModal = () => setLogoutModalVisible(true);
  const hideLogoutModal = () => setLogoutModalVisible(false);

  const handleLogout = () => {
    console.log('User logged out');
    hideLogoutModal();
    // Add navigation or auth logic here
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="w-full max-w-4xl mx-auto p-4 md:p-6">
        {/* Profile Header */}
        <View className="items-center mb-8">
          <View className="relative">
            <Image 
              source={{ uri: user.avatar }} 
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-4"
            />
            <TouchableOpacity className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full">
              <Feather name="edit-2" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-2xl font-bold text-gray-900">{user.name}</Text>
          <Text className="text-gray-600 flex-row items-center">
            <MaterialIcons name="email" size={16} color="#6b7280" className="mr-1" />
            {user.email}
          </Text>
          <Text className="text-gray-500 text-sm mt-1 flex-row items-center">
            <Feather name="calendar" size={14} color="#9ca3af" className="mr-1" />
            {user.joinDate}
          </Text>
        </View>

        {/* Profile Information */}
        <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <View className="flex-row items-center mb-4">
            <Ionicons name="person-circle-outline" size={24} color="#4b5563" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">Personal Information</Text>
          </View>
          
          <View className="border-b border-gray-100 pb-4 mb-4">
            <Text className="text-gray-500 text-sm flex-row items-center">
              <Feather name="user" size={16} color="#9ca3af" className="mr-1" />
              Full Name
            </Text>
            <Text className="text-gray-800 mt-1">{user.name}</Text>
          </View>
          
          <View className="border-b border-gray-100 pb-4 mb-4">
            <Text className="text-gray-500 text-sm flex-row items-center">
              <MaterialIcons name="email" size={16} color="#9ca3af" className="mr-1" />
              Email
            </Text>
            <Text className="text-gray-800 mt-1">{user.email}</Text>
          </View>
          
          <View className="pb-2">
            <Text className="text-gray-500 text-sm flex-row items-center">
              <Feather name="phone" size={16} color="#9ca3af" className="mr-1" />
              Phone
            </Text>
            <Text className="text-gray-800 mt-1">{user.phone}</Text>
          </View>
        </View>

        {/* Settings */}
        <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <View className="flex-row items-center mb-4">
            <Ionicons name="settings-outline" size={24} color="#4b5563" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">Settings</Text>
          </View>
          
          <TouchableOpacity className="py-3 border-b border-gray-100 flex-row items-center">
            <Feather name="lock" size={20} color="#4b5563" className="mr-3" />
            <Text className="text-gray-800 flex-1">Change Password</Text>
            <Feather name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>
          
          <TouchableOpacity className="py-3 border-b border-gray-100 flex-row items-center">
            <Ionicons name="notifications-outline" size={20} color="#4b5563" className="mr-3" />
            <Text className="text-gray-800 flex-1">Notification Preferences</Text>
            <Feather name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>
          
          <TouchableOpacity className="py-3 flex-row items-center">
            <Feather name="shield" size={20} color="#4b5563" className="mr-3" />
            <Text className="text-gray-800 flex-1">Privacy Settings</Text>
            <Feather name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        {/* Logout Button - Now more prominent */}
        <TouchableOpacity 
          className="bg-red-50 border mb-20 border-red-100 rounded-xl p-4 flex-row items-center justify-center mt-1"
          onPress={showLogoutModal}
        >
          <AntDesign name="logout" size={20} color="#dc2626" className="mr-2" />
          <Text className="text-red-600 font-medium">Log Out</Text>
        </TouchableOpacity>

        {/* Logout Confirmation Modal */}
        <Modal
          visible={isLogoutModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={hideLogoutModal}
        >
          <View className="flex-1 justify-center items-center bg-black/50 p-4">
            <View className="bg-white rounded-xl p-6 w-full max-w-md">
              <View className="items-center mb-4">
                <View className="bg-red-100 p-3 rounded-full mb-3">
                  <AntDesign name="logout" size={24} color="#dc2626" />
                </View>
                <Text className="text-xl font-bold text-gray-900">Confirm Logout</Text>
              </View>
              
              <Text className="text-gray-600 text-center mb-6">
                Are you sure you want to log out of your account?
              </Text>
              
              <View className="flex-row justify-between space-x-4">
                <TouchableOpacity 
                  className="flex-1 py-3 border border-gray-300 rounded-lg items-center"
                  onPress={hideLogoutModal}
                >
                  <Text className="text-gray-800 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="flex-1 py-3 bg-red-500 rounded-lg items-center"
                  onPress={handleLogout}
                >
                  <Text className="text-white font-medium">Log Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}