import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  RefreshControl,
  Dimensions,
  Modal,
  Animated,
  ActivityIndicator
} from 'react-native';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Search as SearchIcon, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Send, 
  Smile, 
  MoreHorizontal 
} from 'lucide-react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// Check screen size and platform
const isLargeWeb = Platform.OS === 'web' && windowWidth >= 1024;
const isMediumWeb = Platform.OS === 'web' && windowWidth >= 768;
const isSmallWeb = Platform.OS === 'web' && windowWidth < 768;
const isMobile = Platform.OS !== 'web';

const Explore = () => {
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showStrandsModal, setShowStrandsModal] = useState(false);
  const [currentUser] = useState({
    id: 'user1',
    username: 'student_life',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
  });

  // Strand advertisements data
  const [strands, setStrands] = useState([
    {
      id: 1,
      title: 'STEM Strand',
      description: 'Science, Technology, Engineering, and Mathematics',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      careers: ['Engineer', 'Doctor', 'Scientist', 'Architect'],
      popularity: 'High',
      difficulty: 'Hard'
    },
    {
      id: 2,
      title: 'HUMSS Strand',
      description: 'Humanities and Social Sciences',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      careers: ['Lawyer', 'Journalist', 'Psychologist', 'Teacher'],
      popularity: 'Medium',
      difficulty: 'Moderate'
    },
    {
      id: 3,
      title: 'ABM Strand',
      description: 'Accountancy, Business and Management',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80',
      careers: ['Accountant', 'Entrepreneur', 'Manager', 'Economist'],
      popularity: 'High',
      difficulty: 'Moderate'
    },
    {
      id: 4,
      title: 'TVL Strand',
      description: 'Technical-Vocational-Livelihood',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      careers: ['Chef', 'Electrician', 'Programmer', 'Designer'],
      popularity: 'Medium',
      difficulty: 'Practical'
    },
    {
      id: 5,
      title: 'GAS Strand',
      description: 'General Academic Strand',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      careers: ['College Prep', 'Various Fields', 'Flexible Path', 'Undecided'],
      popularity: 'Medium',
      difficulty: 'Moderate'
    }
  ]);

  // Enhanced dummy posts data with reactions
  const [posts, setPosts] = useState([
    {
      id: 1,
      creator: {
        username: 'education_expert',
        displayName: 'Education Guide',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        followers: '125K',
        bio: 'Helping students choose their academic path 🎓 | Daily educational content',
        isFollowing: false
      },
      slides: [
        {
          id: 1,
          type: 'image',
          content: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
          caption: 'Academic Strand (ABM, STEM, HUMSS) offers a strong foundation for college-bound students'
        },
        {
          id: 2,
          type: 'image',
          content: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
          caption: 'TVL Strand prepares students for skilled work through hands-on training'
        }
      ],
      currentSlide: 0,
      reactions: {
        likes: { count: 1243, users: ['user2', 'user3'] },
        loves: { count: 89, users: [] },
        laughs: { count: 12, users: [] },
        wows: { count: 34, users: [] }
      },
      userReaction: null,
      saved: false,
      shared: false,
      comments: [
        {
          id: 1,
          user: { username: 'study_buddy', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
          text: 'This helped me choose STEM!',
          likes: 24,
          time: '2h ago',
          isLiked: false,
          replies: []
        },
        {
          id: 2,
          user: { username: 'future_engineer', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
          text: 'TVL is underrated tbh',
          likes: 12,
          time: '45m ago',
          isLiked: true,
          replies: []
        }
      ],
      timestamp: '2 days ago',
      title: 'Choosing Your Senior High School Strand'
    },
    {
      id: 2,
      creator: {
        username: 'career_advisor',
        displayName: 'Career Guide Pro',
        avatar: 'https://randomuser.me/api/portraits/men/50.jpg',
        followers: '89K',
        bio: 'Career counselor | Helping students plan their future 🚀',
        isFollowing: true
      },
      slides: [
        {
          id: 1,
          type: 'image',
          content: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80',
          caption: 'Top careers for each senior high school strand - Your guide to success'
        }
      ],
      currentSlide: 0,
      reactions: {
        likes: { count: 892, users: ['user1'] },
        loves: { count: 156, users: ['user1'] },
        laughs: { count: 8, users: [] },
        wows: { count: 67, users: [] }
      },
      userReaction: 'loves',
      saved: true,
      shared: false,
      comments: [
        {
          id: 1,
          user: { username: 'college_bound', avatar: 'https://randomuser.me/api/portraits/men/28.jpg' },
          text: 'This is so helpful! Thank you for sharing.',
          likes: 15,
          time: '1h ago',
          isLiked: false,
          replies: []
        }
      ],
      timestamp: '1 day ago',
      title: 'Career Paths for Every Strand'
    },
    {
      id: 3,
      creator: {
        username: 'stem_teacher',
        displayName: 'Ms. Rodriguez',
        avatar: 'https://randomuser.me/api/portraits/women/60.jpg',
        followers: '67K',
        bio: 'High School STEM Teacher | Making science fun! 🔬⚗️',
        isFollowing: false
      },
      slides: [
        {
          id: 1,
          type: 'image',
          content: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
          caption: 'What to expect in STEM strand - complete guide with tips and tricks'
        }
      ],
      currentSlide: 0,
      reactions: {
        likes: { count: 1245, users: [] },
        loves: { count: 234, users: [] },
        laughs: { count: 45, users: [] },
        wows: { count: 178, users: ['user1'] }
      },
      userReaction: 'wows',
      saved: false,
      shared: true,
      comments: [
        {
          id: 1,
          user: { username: 'science_lover', avatar: 'https://randomuser.me/api/portraits/women/35.jpg' },
          text: 'STEM is challenging but so rewarding!',
          likes: 89,
          time: '3h ago',
          isLiked: true,
          replies: []
        }
      ],
      timestamp: '6 hours ago',
      title: 'STEM Strand Complete Guide'
    }
  ]);

  const [filteredPosts, setFilteredPosts] = useState(posts);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.creator.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  // Pull to refresh simulation
  const handleRefresh = async () => {
    setRefreshing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Randomly shuffle posts and update reaction counts
    const shuffledPosts = [...posts].sort(() => Math.random() - 0.5).map(post => ({
      ...post,
      reactions: {
        ...post.reactions,
        likes: { ...post.reactions.likes, count: post.reactions.likes.count + Math.floor(Math.random() * 50) },
        loves: { ...post.reactions.loves, count: post.reactions.loves.count + Math.floor(Math.random() * 20) }
      }
    }));
    
    setPosts(shuffledPosts);
    setRefreshing(false);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const toggleReaction = (postId, reactionType) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newPost = { ...post };
        
        // Remove previous reaction if exists
        if (newPost.userReaction) {
          newPost.reactions[newPost.userReaction].count--;
          newPost.reactions[newPost.userReaction].users = 
            newPost.reactions[newPost.userReaction].users.filter(u => u !== currentUser.id);
        }
        
        // Add new reaction or remove if same
        if (newPost.userReaction === reactionType) {
          newPost.userReaction = null;
        } else {
          newPost.reactions[reactionType].count++;
          newPost.reactions[reactionType].users.push(currentUser.id);
          newPost.userReaction = reactionType;
        }
        
        return newPost;
      }
      return post;
    }));
  };

  const toggleSave = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, saved: !post.saved } : post
    ));
  };

  const toggleFollow = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, creator: { ...post.creator, isFollowing: !post.creator.isFollowing } }
        : post
    ));
  };

  const openComments = (post) => {
    setSelectedPost(post);
    setShowComments(true);
  };

  const ReactionButton = ({ post, type, icon, activeColor, label }) => {
    const isActive = post.userReaction === type;
    const count = post.reactions[type]?.count || 0;
    
    return (
      <TouchableOpacity
        onPress={() => toggleReaction(post.id, type)}
        className={`flex-row items-center px-3 py-2 rounded-full ${isActive ? `bg-[${activeColor}]` : !isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
      >
        {icon}
        <Text className={`text-sm font-medium ml-1 ${isActive ? 'text-white' : !isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {formatNumber(count)}
        </Text>
      </TouchableOpacity>
    );
  };

  const StrandCard = ({ strand, compact = false }) => {
    return (
      <View className={`rounded-xl overflow-hidden mb-4 ${!isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {!compact && (
          <Image
            source={{ uri: strand.image }}
            className="w-full h-32"
          />
        )}
        <View className="p-4">
          <Text className={`${compact ? 'text-sm' : 'text-lg'} font-bold ${!isDark ? 'text-white' : 'text-gray-900'}`}>
            {strand.title}
          </Text>
          {!compact && (
            <>
              <Text className={`text-sm mt-1 ${!isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {strand.description}
              </Text>
              
              <View className="flex-row mt-3">
                <View className={`px-2 py-1 rounded-md mr-2 ${!isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <Text className={`text-xs ${!isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Popularity: {strand.popularity}
                  </Text>
                </View>
                <View className={`px-2 py-1 rounded-md ${!isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <Text className={`text-xs ${!isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Difficulty: {strand.difficulty}
                  </Text>
                </View>
              </View>
              
              <Text className={`text-sm mt-3 font-semibold ${!isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Career Paths:
              </Text>
              <View className="flex-row flex-wrap mt-1">
                {strand.careers.map((career, index) => (
                  <View 
                    key={index} 
                    className={`px-2 py-1 rounded-md mr-2 mb-2 ${!isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
                  >
                    <Text className={`text-xs ${!isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {career}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
          
          {!compact && (
            <TouchableOpacity 
              className={`mt-4 py-2 rounded-full items-center ${!isDark ? 'bg-blue-600' : 'bg-blue-500'}`}
            >
              <Text className="text-white font-medium">Learn More</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const PostCard = ({ post }) => {
    const nextSlide = () => {
      setPosts(posts.map(p => 
        p.id === post.id 
          ? { ...p, currentSlide: (p.currentSlide + 1) % p.slides.length }
          : p
      ));
    };

    const prevSlide = () => {
      setPosts(posts.map(p => 
        p.id === post.id 
          ? { ...p, currentSlide: p.currentSlide === 0 ? p.slides.length - 1 : p.currentSlide - 1 }
          : p
      ));
    };

    return (
      <View className={`rounded-2xl overflow-hidden mb-6 ${!isDark ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Post Header */}
        <View className="flex-row justify-between items-center p-4">
          <View className="flex-row items-center">
            <Image
              source={{ uri: post.creator.avatar }}
              className="w-12 h-12 rounded-full"
            />
            <View className="ml-3">
              <Text className={`font-bold ${!isDark ? 'text-white' : 'text-gray-900'}`}>
                @{post.creator.username}
              </Text>
              <Text className={`${!isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {post.creator.displayName}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => toggleFollow(post.id)}
              className={`px-4 py-1.5 rounded-full mr-2 ${post.creator.isFollowing ? !isDark ? 'bg-gray-700' : 'bg-gray-200' : 'bg-blue-500'}`}
            >
              <Text className={`font-semibold ${post.creator.isFollowing ? !isDark ? 'text-white' : 'text-gray-800' : 'text-white'}`}>
                {post.creator.isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-2">
              <MoreHorizontal 
                size={20} 
                color={!isDark ? '#9ca3af' : '#6b7280'} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Post Content */}
        <View className="relative">
          <Image
            source={{ uri: post.slides[post.currentSlide].content }}
            className="w-full aspect-square"
          />
          
          {/* Slide Navigation */}
          {post.slides.length > 1 && (
            <>
              <TouchableOpacity
                onPress={prevSlide}
                className="absolute top-1/2 left-4 bg-black/50 rounded-full p-2"
                style={{ transform: [{ translateY: -10 }] }}
              >
                <ChevronLeft size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={nextSlide}
                className="absolute top-1/2 right-4 bg-black/50 rounded-full p-2"
                style={{ transform: [{ translateY: -10 }] }}
              >
                <ChevronRight size={20} color="white" />
              </TouchableOpacity>
              
              {/* Slide Indicators */}
              <View className="absolute bottom-4 left-1/2 flex-row" style={{ transform: [{ translateX: -50 }] }}>
                {post.slides.map((_, index) => (
                  <View
                    key={index}
                    className={`h-1 mx-1 rounded-full ${index === post.currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                  />
                ))}
              </View>
            </>
          )}
          
          {/* Caption Overlay */}
          <View className="absolute bottom-12 left-4 right-4">
            <Text className="text-white text-lg font-semibold shadow-md">
              {post.slides[post.currentSlide].caption}
            </Text>
          </View>
        </View>

        {/* Reactions */}
        <View className="p-4">
          <View className="flex-row flex-wrap mb-4 gap-2">
            <ReactionButton
              post={post}
              type="likes"
              icon={<Heart size={20} color={post.userReaction === 'likes' ? 'white' : !isDark ? '#d1d5db' : '#4b5563'} />}
              activeColor="#ef4444"
              label="Like"
            />
            <ReactionButton
              post={post}
              type="loves"
              icon={<Heart size={20} fill={post.userReaction === 'loves' ? '#ec4899' : 'none'} color={post.userReaction === 'loves' ? 'white' : isDark ? '#d1d5db' : '#4b5563'} />}
              activeColor="#ec4899"
              label="Love"
            />
            <ReactionButton
              post={post}
              type="wows"
              icon={<Text className="text-xl">😮</Text>}
              activeColor="#eab308"
              label="Wow"
            />
            <ReactionButton
              post={post}
              type="laughs"
              icon={<Text className="text-xl">😂</Text>}
              activeColor="#22c55e"
              label="Haha"
            />
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => openComments(post)}
                className="flex-row items-center"
              >
                <MessageCircle 
                  size={20} 
                  color={!isDark ? '#9ca3af' : '#6b7280'} 
                />
                <Text className={`text-sm ml-1 ${!isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {post.comments.length}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => toggleSave(post.id)}
                className="p-2"
              >
                <Bookmark 
                  size={20} 
                  fill={post.saved ? '#eab308' : 'none'} 
                  color={post.saved ? '#eab308' : !isDark ? '#9ca3af' : '#6b7280'} 
                />
              </TouchableOpacity>
              <TouchableOpacity className="p-2">
                <Share2 
                  size={20} 
                  color={!isDark ? '#9ca3af' : '#6b7280'} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Post Info */}
          <View className="mt-2">
            <Text className={`text-lg font-bold ${!isDark ? 'text-white' : 'text-gray-900'}`}>
              {post.title}
            </Text>
            <Text className={`text-sm mt-1 ${!isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {post.creator.bio}
            </Text>
            <Text className={`text-xs mt-2 ${!isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {post.timestamp}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const CommentsModal = () => {
    if (!selectedPost) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showComments}
        onRequestClose={() => setShowComments(false)}
      >
        <TouchableOpacity   onPress={() => setShowComments(false)} className={`flex-1 justify-end ${!isDark ? 'bg-black/80' : 'bg-black/50'} `}>
          <View className={`${!isDark ? 'bg-gray-900' : 'bg-white'} h-[80vh] max-h-[600px] `}>
            {/* Header */}
            <View className="flex-row justify-between items-center p-4 border-b border-gray-300">
              <Text className={`text-lg font-bold ${!isDark ? 'text-white' : 'text-gray-900'}`}>
                Comments ({selectedPost.comments.length})
              </Text>
              <TouchableOpacity
                onPress={() => setShowComments(false)}
                className="p-2"
              >
                <X 
                  size={20} 
                  color={!isDark ? '#9ca3af' : '#6b7280'} 
                />
              </TouchableOpacity>
            </View>

            {/* Comments List */}
            <ScrollView className="flex-1 p-4">
              {selectedPost.comments.map(comment => (
                <View key={comment.id} className="flex-row mb-4">
                  <Image
                    source={{ uri: comment.user.avatar }}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <View className="flex-1">
                    <View className={`p-3 rounded-xl ${!isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <Text className={`font-bold ${!isDark ? 'text-white' : 'text-gray-900'}`}>
                        @{comment.user.username}
                      </Text>
                      <Text className={`${!isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {comment.text}
                      </Text>
                    </View>
                    <View className="flex-row mt-1 ml-3">
                      <Text className={`text-xs mr-3 ${!isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {comment.time}
                      </Text>
                      <TouchableOpacity>
                        <Text className={`text-xs mr-3 ${!isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {comment.likes} likes
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text className={`text-xs mr-3 ${!isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Reply
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Comment Input */}
            <View className={`p-4 border-t ${!isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <View className="flex-row items-center">
                <Image
                  source={{ uri: currentUser.avatar }}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <View className={`flex-1 flex-row items-center rounded-full px-4 py-2 ${!isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <TextInput
                    placeholder="Add a comment..."
                    placeholderTextColor={!isDark ? '#6b7280' : '#9ca3af'}
                    className={`flex-1 ${!isDark ? 'text-white' : 'text-gray-900'}`}
                  />
                  <TouchableOpacity className="p-2">
                    <Smile 
                      size={20} 
                      color={!isDark ? '#9ca3af' : '#6b7280'} 
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity className="p-2">
                  <Send 
                    size={20} 
                    color="#3b82f6" 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const StrandsModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={showStrandsModal}
        onRequestClose={() => setShowStrandsModal(false)}
      >
        <View className={`flex-1 ${!isDark ? 'bg-gray-900' : 'bg-white'}`}>
          {/* Header */}
          <View className={`flex-row justify-between items-center p-4 border-b ${!isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <Text className={`text-xl font-bold ${!isDark ? 'text-white' : 'text-gray-900'}`}>
              Senior High Strands Guide
            </Text>
            <TouchableOpacity
              onPress={() => setShowStrandsModal(false)}
              className="p-2"
            >
              <X 
                size={24} 
                color={isDark ? '#9ca3af' : '#6b7280'} 
              />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="p-4">
            {strands.map(strand => (
              <StrandCard key={strand.id} strand={strand} />
            ))}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <View className={`flex-1 ${!isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className={`${!isDark ? 'bg-gray-900' : 'bg-white'} pt-2 pb-4 border-b border-gray-300 z-10`}>
        <View className="px-4">
          {/* Search Bar */}
          <View className="mt-2">
            <View className={`flex-row items-center rounded-full px-4 py-2 ${!isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <SearchIcon 
                size={16} 
                color={!isDark ? '#9ca3af' : '#6b7280'} 
                className="mr-2"
              />
              <TextInput
                placeholder="Search posts, users, or topics..."
                placeholderTextColor={!isDark ? '#6b7280' : '#9ca3af'}
                value={searchQuery}
                onChangeText={setSearchQuery}
                className={`flex-1 ${!isDark ? 'text-white' : 'text-gray-900'}`}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-row flex-1 ">
        {/* Posts Column - takes full width on mobile and small web, 75% on medium web, 66% on large web */}
        <ScrollView
          className={isMobile || isSmallWeb ? "flex-1" : isMediumWeb ? "flex-[3]" : "flex-[2]"}
          contentContainerStyle={{}}
          refreshControl={
            Platform.OS !== 'web' ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#3b82f6']}
                tintColor={!isDark ? '#3b82f6' : '#3b82f6'}
                progressViewOffset={30}
              />
            ) : null
          }
        >
          <View className={`${isLargeWeb || isMediumWeb ? 'px-4' : 'px-0'} pb-0`}>
            {filteredPosts.length === 0 ? (
              <View className="items-center justify-center py-12 px-2">
                <SearchIcon 
                  size={48} 
                  color={!isDark ? '#6b7280' : '#9ca3af'} 
                  className="opacity-50"
                />
                <Text className={`text-lg mt-4 ${!isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No posts found
                </Text>
                <Text className={`text-sm mt-1 ${!isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Try searching for something else
                </Text>
              </View>
            ) : (
              filteredPosts.map(post => (
                <View key={post.id} className="mb-20">
                  <PostCard post={post} />
                </View>
              ))
            )}
          </View>
        </ScrollView>
        {/* Sidebar Column - only on medium and large web */}
        {(isMediumWeb || isLargeWeb) && (
          <ScrollView 
            style={{ width: isLargeWeb ? 90 : 90 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            className={`p-4  border-l ${!isDark ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <Text className={`text-lg font-bold mb-4 ${!isDark ? 'text-white' : 'text-gray-900'}`}>
              Senior High Strands
            </Text>

            {strands.map(strand => (
              <StrandCard key={strand.id} strand={strand} />
            ))}

            <Text className={`text-sm mt-4 ${!isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Need help choosing your strand?
            </Text>

            <TouchableOpacity 
              className={`mt-4 py-2 rounded-full items-center ${!isDark ? 'bg-blue-600' : 'bg-blue-500'}`}
            >
              <Text className="text-white font-medium">Take Strand Quiz</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Mobile Strands Button - only on mobile and small web */}
        {(isMobile || isSmallWeb) && (
          <TouchableOpacity 
            onPress={() => setShowStrandsModal(true)}
            className={`absolute bottom-6 right-6 p-4 rounded-full ${!isDark ? 'bg-blue-600' : 'bg-blue-500'}`}
            style={{ elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}
          >
            <Text className="text-white font-bold">Strands</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Comments Modal */}
      <CommentsModal />
      
      {/* Strands Modal (mobile and small web only) */}
      <StrandsModal />
    </View>
  );
};

export default Explore;