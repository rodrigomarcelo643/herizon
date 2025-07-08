import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  ActivityIndicator
} from 'react-native';
import { 
  Bot, 
  BookOpen, 
  GraduationCap, 
  Lightbulb, 
  Rocket, 
  BarChart2,
  ChevronRight,
  MessageSquare,
  Clock,
  Bookmark,
  Star,
  HelpCircle
} from 'lucide-react-native';
import { Link } from 'expo-router';

// Skeleton Loader Component
const SkeletonLoader = ({ width, height, borderRadius = 4, style = {}, children }) => {
  return (
    <View 
      className="bg-gray-100 dark:bg-gray-800 mb-2  overflow-hidden"
      style={[{ width, height, borderRadius }, style]}
    >
      <View className="w-full h-full mb-2  bg-gray-200 dark:bg-gray-700" style={{ opacity: 0.5 }}>
        {children}
      </View>
    </View>
  );
};

// Skeleton with pulse animation
const SkeletonPulse = () => {
  return (
    <View className="absolute top-0 left-0 mb-2  right-0 bottom-0 bg-gray-300 dark:bg-gray-600 opacity-20" 
      style={{
        animationDuration: '1.5s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease-in-out',
        animationKeyframes: {
          '0%': { opacity: 0.2 },
          '50%': { opacity: 0.4 },
          '100%': { opacity: 0.2 },
        }
      }}
    />
  );
};

export default function Home() {
  const { width } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recommended');

  const isWeb = Platform.OS === 'web';
  const isLargeWeb = isWeb && width >= 1024;
  const isMobile = !isWeb || width < 768;

  // Mock data - replace with your actual data
  const recommendedStrands = [
    { id: '1', name: 'STEM', match: 92, description: 'Science, Technology, Engineering, and Mathematics' },
    { id: '2', name: 'HUMSS', match: 85, description: 'Humanities and Social Sciences' },
    { id: '3', name: 'ABM', match: 78, description: 'Accountancy, Business, and Management' },
  ];

  const quickLinks = [
    { icon: <BookOpen size={20} color="#4F46E5" />, title: 'Learning Resources', screen: 'resources' },
    { icon: <GraduationCap size={20} color="#4F46E5" />, title: 'Career Paths', screen: 'careers' },
    { icon: <Lightbulb size={20} color="#4F46E5" />, title: 'Skill Assessment', screen: 'assessment' },
    { icon: <Rocket size={20} color="#4F46E5" />, title: 'Goal Setting', screen: 'goals' },
  ];

  const recentActivities = [
    { id: '1', icon: <MessageSquare size={16} color="#666" />, title: 'Career chat with AI', time: '2 hours ago' },
    { id: '2', icon: <Bookmark size={16} color="#666" />, title: 'Saved STEM resources', time: 'Yesterday' },
    { id: '3', icon: <Star size={16} color="#666" />, title: 'Completed assessment', time: '3 days ago' },
  ];

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <ScrollView className={`flex-1 p-4 bg-white dark:bg-gray-900 ${isLargeWeb ? 'pl-2' : ''}`}>
        {/* Welcome Section Skeleton */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <SkeletonLoader width={120} height={24}>
              <SkeletonPulse />
            </SkeletonLoader>
            <SkeletonLoader width={180} height={32} className="mt-2">
              <SkeletonPulse />
            </SkeletonLoader>
          </View>
          <SkeletonLoader width={150} height={40} borderRadius={20}>
            <SkeletonPulse />
          </SkeletonLoader>
        </View>

        {/* Quick Links Skeleton */}
        <View className="mb-8">
          <SkeletonLoader width={120} height={24} className="mb-4">
            <SkeletonPulse />
          </SkeletonLoader>
          <View className={`flex-row ${isMobile ? 'flex-wrap' : 'justify-between'} gap-3`}>
            {[1, 2, 3, 4].map((_, index) => (
              <SkeletonLoader 
                key={index} 
                width={isMobile ? '48%' : '23%'} 
                height={100} 
                borderRadius={12}
              >
                <SkeletonPulse />
                <View className="absolute top-4 left-0 right-0 items-center">
                  <SkeletonLoader width={32} height={32} borderRadius={16}>
                    <SkeletonPulse />
                  </SkeletonLoader>
                </View>
                <View className="absolute bottom-4 left-0 right-0 px-2">
                  <SkeletonLoader width="80%" height={16} borderRadius={4} className="mx-auto">
                    <SkeletonPulse />
                  </SkeletonLoader>
                </View>
              </SkeletonLoader>
            ))}
          </View>
        </View>

        {/* Strand Recommendations Skeleton */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <SkeletonLoader width={180} height={24}>
              <SkeletonPulse />
            </SkeletonLoader>
            <SkeletonLoader width={80} height={20}>
              <SkeletonPulse />
            </SkeletonLoader>
          </View>
          
          {/* Tab Skeleton */}
          <SkeletonLoader width="100%" height={48} borderRadius={8} className="mb-4">
            <SkeletonPulse />
          </SkeletonLoader>
          
          {/* Strand Cards Skeleton */}
          <View className="gap-3">
            {[1, 2, 3].map((_, index) => (
              <SkeletonLoader key={index} width="100%" height={120} borderRadius={12}>
                <SkeletonPulse />
                <View className="absolute top-4 left-4 right-4 flex-row justify-between">
                  <SkeletonLoader width={80} height={24}>
                    <SkeletonPulse />
                  </SkeletonLoader>
                  <SkeletonLoader width={60} height={24} borderRadius={12}>
                    <SkeletonPulse />
                  </SkeletonLoader>
                </View>
                <View className="absolute top-14 left-4 right-4">
                  <SkeletonLoader width="90%" height={16} className="mb-2">
                    <SkeletonPulse />
                  </SkeletonLoader>
                  <SkeletonLoader width="70%" height={16}>
                    <SkeletonPulse />
                  </SkeletonLoader>
                </View>
                <View className="absolute bottom-4 left-4">
                  <SkeletonLoader width={100} height={16}>
                    <SkeletonPulse />
                  </SkeletonLoader>
                </View>
              </SkeletonLoader>
            ))}
          </View>
        </View>

        {/* Recent Activity Skeleton */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <SkeletonLoader width={120} height={24}>
              <SkeletonPulse />
            </SkeletonLoader>
            <SkeletonLoader width={80} height={20}>
              <SkeletonPulse />
            </SkeletonLoader>
          </View>
          <View className="gap-2">
            {[1, 2, 3].map((_, index) => (
              <SkeletonLoader key={index} width="100%" height={60} borderRadius={8}>
                <SkeletonPulse />
                <View className="absolute left-3 top-3">
                  <SkeletonLoader width={32} height={32} borderRadius={16}>
                    <SkeletonPulse />
                  </SkeletonLoader>
                </View>
                <View className="absolute left-16 top-3">
                  <SkeletonLoader width={120} height={16} className="mb-1">
                    <SkeletonPulse />
                  </SkeletonLoader>
                  <SkeletonLoader width={80} height={12}>
                    <SkeletonPulse />
                  </SkeletonLoader>
                </View>
                <View className="absolute right-3 top-3">
                  <SkeletonLoader width={24} height={24} borderRadius={12}>
                    <SkeletonPulse />
                  </SkeletonLoader>
                </View>
              </SkeletonLoader>
            ))}
          </View>
        </View>

        {/* Stats Overview Skeleton */}
        <View className="mb-8">
          <SkeletonLoader width={180} height={24} className="mb-4">
            <SkeletonPulse />
          </SkeletonLoader>
          <View className={`flex-row ${isMobile ? 'flex-col' : 'flex-row'} gap-3`}>
            {[1, 2, 3].map((_, index) => (
              <SkeletonLoader key={index} width={isMobile ? '100%' : '32%'} height={120} borderRadius={12}>
                <SkeletonPulse />
                <View className="absolute top-4 left-0 right-0 items-center">
                  <SkeletonLoader width={32} height={32} borderRadius={16}>
                    <SkeletonPulse />
                  </SkeletonLoader>
                </View>
                <View className="absolute top-16 left-0 right-0 items-center">
                  <SkeletonLoader width={60} height={32}>
                    <SkeletonPulse />
                  </SkeletonLoader>
                </View>
                <View className="absolute bottom-4 left-0 right-0 px-2">
                  <SkeletonLoader width="80%" height={16} borderRadius={4} className="mx-auto">
                    <SkeletonPulse />
                  </SkeletonLoader>
                </View>
              </SkeletonLoader>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className={`flex-1 p-4 bg-white dark:bg-gray-900 ${isLargeWeb ? 'p-4' : ''}`}>
      {/* Welcome Section */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-lg text-gray-900 dark:text-white">
            Welcome back,
          </Text>
          <Text className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            Student!
          </Text>
        </View>
        <TouchableOpacity 
          className="flex-row items-center bg-indigo-600 py-2 px-4 rounded-full gap-2"
          activeOpacity={0.8}
        >
          <Bot size={24} color="#fff" />
          <Text className="text-white font-medium">AI Assistant</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Links */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Access
        </Text>
        <View className={`flex-row ${isMobile ? 'flex-wrap' : 'justify-between'} gap-3`}>
          {quickLinks.map((link, index) => (
            <Link href={`/${link.screen}`} key={index} asChild>
              <TouchableOpacity 
                className={`${isMobile ? 'w-[48%]' : 'flex-1'} items-center p-4 rounded-xl bg-indigo-50 dark:bg-gray-800`}
                activeOpacity={0.7}
              >
                <View className="mb-2">
                  {link.icon}
                </View>
                <Text className="text-sm font-medium text-gray-900 dark:text-white text-center">
                  {link.title}
                </Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </View>

      {/* Strand Recommendations */}
      <View className="mb-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Recommended Strands
          </Text>
          <Link href="/path" asChild>
            <TouchableOpacity className="flex-row items-center gap-1" activeOpacity={0.7}>
              <Text className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                See all
              </Text>
              <ChevronRight size={16} color="#4F46E5" />
            </TouchableOpacity>
          </Link>
        </View>

        <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-4">
          <TouchableOpacity 
            className={`flex-1 items-center py-2 rounded ${activeTab === 'recommended' ? 'bg-indigo-600 shadow' : ''}`}
            onPress={() => setActiveTab('recommended')}
            activeOpacity={0.7}
          >
            <Text className={`text-sm font-medium ${activeTab === 'recommended' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Recommended
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 items-center py-2 rounded ${activeTab === 'all' ? 'bg-indigo-600 shadow' : ''}`}
            onPress={() => setActiveTab('all')}
            activeOpacity={0.7}
          >
            <Text className={`text-sm font-medium ${activeTab === 'all' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              All Strands
            </Text>
          </TouchableOpacity>
        </View>

        <View className="gap-3">
          {recommendedStrands.map((strand) => (
            <View 
              key={strand.id} 
              className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                  {strand.name}
                </Text>
                <View className="bg-green-100 py-1 px-2 rounded-full">
                  <Text className="text-xs font-semibold text-green-600">{strand.match}% match</Text>
                </View>
              </View>
              <Text className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {strand.description}
              </Text>
              <Link href={`/strand-details/${strand.id}`} asChild>
                <TouchableOpacity className="flex-row items-center gap-1" activeOpacity={0.7}>
                  <Text className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    View details
                  </Text>
                  <ChevronRight size={16} color="#4F46E5" />
                </TouchableOpacity>
              </Link>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View className="mb-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </Text>
          <Link href="/activity" asChild>
            <TouchableOpacity className="flex-row items-center gap-1" activeOpacity={0.7}>
              <Text className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                See all
              </Text>
              <ChevronRight size={16} color="#4F46E5" />
            </TouchableOpacity>
          </Link>
        </View>

        <View className="gap-2">
          {recentActivities.map((activity) => (
            <View 
              key={activity.id} 
              className="flex-row items-center p-3 rounded-lg bg-white dark:bg-gray-800 gap-3"
            >
              <View className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center">
                {activity.icon}
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {activity.title}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Clock size={12} color="#666" />
                  <Text className="text-xs text-gray-600 dark:text-gray-300">
                    {activity.time}
                  </Text>
                </View>
              </View>
              <HelpCircle size={16} color="#666" />
            </View>
          ))}
        </View>
      </View>

      {/* Stats Overview */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Your Progress Overview
        </Text>
        <View className={`flex-row ${isMobile ? 'flex-col' : 'flex-row'} gap-3`}>
          <View className={`${isMobile ? 'w-full' : 'flex-1'} items-center p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm`}>
            <BarChart2 size={24} color="#4F46E5" />
            <Text className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 my-2">85%</Text>
            <Text className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Career Match
            </Text>
          </View>
          <View className={`${isMobile ? 'w-full' : 'flex-1'} items-center p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm`}>
            <BookOpen size={24} color="#4F46E5" />
            <Text className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 my-2">12</Text>
            <Text className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Resources Viewed
            </Text>
          </View>
          <View className={`${isMobile ? 'w-full' : 'flex-1'} items-center p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm`}>
            <GraduationCap size={24} color="#4F46E5" />
            <Text className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 my-2">3</Text>
            <Text className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Saved Paths
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}