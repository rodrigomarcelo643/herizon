import { Tabs } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  Platform,
  View,
  Text,
  useWindowDimensions,
  Image,
  Animated,
  Easing,
  TouchableOpacity,
  StatusBar,
  Modal,
  PanResponder,
  Linking,
  TextInput,
  StyleSheet,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Link, usePathname } from 'expo-router';
import { 
  Home as HomeIcon, 
  Send as SendIcon, 
  QrCode as QrCodeIcon, 
  ArrowUpRight as ArrowUpRightIcon, 
  User as UserIcon,
  Bell as BellIcon,
  X as CloseIcon,
  Key as KeyIcon,
  Flashlight as FlashIcon,
  FlashlightOff as FlashOffIcon,
  ArrowLeft as BackIcon,
  Menu as MenuIcon,
  BookOpen as CoursesIcon,
  Calendar as ScheduleIcon,
  MessageSquare as MessagesIcon,
  Settings as SettingsIcon,
  HelpCircle as HelpIcon,
  LogOut as LogoutIcon,
} from 'lucide-react-native';
import { createStyles } from '@/assets/styles/userLayout';

const Skeleton = ({ width, height, borderRadius = 4, style = {} }) => {
  return (
    <View 
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#e1e1e1',
          overflow: 'hidden',
        },
        style
      ]}
    >
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f5f5f5',
        }}
      />
    </View>
  );
};

function SidebarTab({
  Icon,
  label,
  route,
  tintColor,
  size = 24,
  isLoading = false,
  styles,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  route: string;
  tintColor: string;
  size?: number;
  isLoading?: boolean;
  styles: any;
}) {
  const pathname = usePathname();
  const isActive = pathname === `/(tabs)/${route}` || pathname === `/${route}`;

  return (
    <Link href={`/${route}`} asChild>
      <View style={styles.sidebarItem}>
        {isLoading ? (
          <Skeleton width={size} height={size} borderRadius={size/2} />
        ) : (
          <Icon size={size} color={isActive ? tintColor : '#999'} />
        )}
        {isLoading ? (
          <Skeleton width={40} height={12} style={{ marginTop: 4 }} />
        ) : (
          <Text style={[styles.sidebarLabel, { color: isActive ? tintColor : '#999' }]}>
            {label}
          </Text>
        )}
      </View>
    </Link>
  );
}

function SidebarQR({
  route,
  tintColor,
  size = 28,
  isLoading = false,
  onPress,
  styles,
}: {
  route: string;
  tintColor: string;
  size?: number;
  isLoading?: boolean;
  onPress?: () => void;
  styles: any;
}) {
  const pathname = usePathname();
  const isActive = pathname === `/(tabs)/${route}` || pathname === `/${route}`;

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          ...styles.qrCodeSidebar,
          backgroundColor: isActive ? tintColor : '#fff',
          borderColor: tintColor,
        }}
      >
        {isLoading ? (
          <Skeleton width={size} height={size} borderRadius={size/2} />
        ) : (
          <QrCodeIcon
            size={size}
            color={isActive ? '#fff' : tintColor}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

function DrawerLink({
  Icon,
  label,
  onPress,
  color,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  onPress?: () => void;
  color?: string;
}) {
  return (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
      <Icon size={18} color={color || '#333'} />
      <Text style={[styles.drawerLabel, { color: color || '#333' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  drawerContent: {
    width: '80%',
    backgroundColor: '#fff',
    height: '100%',
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  drawerLabel: {
    marginLeft: 15,
    fontSize: 14,
    fontWeight: '500',
  },
  menuButton: {
    padding: 10,
    marginLeft: 10,
  },
  quickLinksTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 8,
    paddingLeft: 10,
    letterSpacing: 0.5,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 10,
  },
  drawerLogo: {
    width: 30,
    height: 30,
  },
})

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme ?? 'light');
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  const { width, height } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const panY = React.useRef(new Animated.Value(height)).current;
  const drawerAnim = React.useRef(new Animated.Value(-width)).current;
  const sheetHeight = height * 0.9;
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const isWeb = Platform.OS === 'web';
  const isLargeWeb = isWeb && width >= 1024;

  const iconSize = isLargeWeb ? 24 : 26;
  const qrIconSize = isLargeWeb ? 28 : 28;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showDrawer) {
      Animated.timing(drawerAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(drawerAnim, {
        toValue: -width,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [showDrawer]);

  useEffect(() => {
    const getCameraPermissions = async () => {
      if (showQRModal && !isWeb) {
        const { granted } = await requestPermission();
        if (!granted) {
          alert('Camera permission is required to scan QR codes');
        }
      }
    };

    getCameraPermissions();
  }, [showQRModal, isWeb]);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50 || gestureState.vy > 0.5) {
          handleCloseQR();
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const resetPosition = () => {
    Animated.spring(panY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const handleQRPress = () => {
    setShowQRModal(true);
    setShowManualInput(false);
    panY.setValue(sheetHeight);
    Animated.spring(panY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseQR = () => {
    Animated.spring(panY, {
      toValue: sheetHeight,
      useNativeDriver: true,
    }).start(() => {
      setShowQRModal(false);
      setScanned(false);
      setFlashlightOn(false);
      setShowManualInput(false);
    });
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    Linking.canOpenURL(data).then(supported => {
      if (supported) {
        Linking.openURL(data);
      } else {
        alert(`Scanned QR code: ${data}`);
      }
    });
    handleCloseQR();
  };

  const toggleFlashlight = () => {
    setFlashlightOn(!flashlightOn);
  };

  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
  };

  const renderScanner = () => {
    if (isWeb) {
      return (
        <View style={styles.webScannerPlaceholder}>
          <QrCodeIcon size={120} color={tintColor} />
          <Text style={styles.webScannerText}>QR Scanner would appear here on mobile</Text>
        </View>
      );
    }

    if (!permission?.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Camera permission is required to scan QR codes</Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417', 'ean13', 'ean8', 'upc_a', 'upc_e'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          enableTorch={flashlightOn}
        >
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame}>
              <View style={[styles.corner, styles.topLeftCorner]} />
              <View style={[styles.corner, styles.topRightCorner]} />
              <View style={[styles.corner, styles.bottomLeftCorner]} />
              <View style={[styles.corner, styles.bottomRightCorner]} />
            </View>
          </View>
        </CameraView>
        <View style={styles.scannerControls}>
          <TouchableOpacity onPress={toggleFlashlight} style={styles.controlButton}>
            {flashlightOn ? (
              <FlashOffIcon size={28} color="#fff" />
            ) : (
              <FlashIcon size={28} color="#fff" />
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setScanned(false)} 
            style={[styles.controlButton, styles.scanAgainButton]}
          >
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderManualInput = () => (
    <View style={styles.manualInputContainer}>
      <View style={styles.manualInputHeader}>
        <TouchableOpacity 
          onPress={() => setShowManualInput(false)}
          style={styles.backButton}
        >
          <BackIcon size={24} color={tintColor} />
          <Text style={[styles.backButtonText, { color: tintColor }]}>Back to Scan</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputContainer}>
        <KeyIcon size={24} color={tintColor} style={styles.inputIcon} />
        <TextInput
          style={styles.codeInput}
          placeholder="Enter code here"
          value={manualCode}
          onChangeText={setManualCode}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <TouchableOpacity 
        style={styles.submitButton}
        onPress={() => {
          alert(`Code entered: ${manualCode}`);
          handleCloseQR();
        }}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {!isLargeWeb && (
        <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
          <MenuIcon size={24} color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
      )}
      <View style={{ flex: 1 }} />
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.notificationButton}>
          {isLoading ? (
            <Skeleton width={24} height={24} borderRadius={12} />
          ) : (
            <>
              <BellIcon size={24} color={Colors[colorScheme ?? 'light'].text} />
              <View style={styles.notificationBadge} />
            </>
          )}
        </TouchableOpacity>
        {isLoading ? (
          <View style={styles.userInfoContainer}>
            <Skeleton width={36} height={36} borderRadius={18} />
            <View style={styles.userTextContainer}>
              <Skeleton width={100} height={14} style={{ marginBottom: 4 }} />
              <Skeleton width={50} height={12} />
            </View>
          </View>
        ) : (
         <View style={styles.userInfoContainer}>
          <Image
            source={require('@/assets/images/profile-pic.jpg')}
            style={styles.avatar}
          />
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>Marcelo Rodrigo</Text>
            <View style={styles.userBadge}>
              <Text style={styles.userBadgeText}>Student</Text>
            </View>
          </View>
        </View>
        )}
      </View>
    </View>
  );

  const renderSidebar = () => (
    <Animated.View 
      style={[
        styles.sidebar,
        { opacity: fadeAnim }
      ]}
    >
      <View style={styles.logoContainer}>
        {isLoading ? (
          <Skeleton width={48} height={48} borderRadius={24} />
        ) : (
          <>
            <Image
              source={require('@/assets/images/education-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoTitle}>EduConnect</Text>
            <Text style={styles.logoTitle} className="mb-3">V1</Text>
          </>
        )}
      </View>

      <View style={styles.sidebarGroup}>
        <SidebarTab Icon={HomeIcon} label="Home" route="home" tintColor={tintColor} size={iconSize} isLoading={isLoading} styles={styles} />
        <SidebarTab Icon={SendIcon} label="Explore" route="explore" tintColor={tintColor} size={iconSize} isLoading={isLoading} styles={styles} />
      </View>

      <SidebarQR route="qr-code" tintColor={tintColor} size={qrIconSize} isLoading={isLoading} onPress={handleQRPress} styles={styles} />

      <View style={styles.sidebarGroup}>
        <SidebarTab Icon={ArrowUpRightIcon} label="Path" route="path" tintColor={tintColor} size={iconSize} isLoading={isLoading} styles={styles} />
        <SidebarTab Icon={UserIcon} label="Profile" route="profile" tintColor={tintColor} size={iconSize} isLoading={isLoading} styles={styles} />
      </View>
    </Animated.View>
  );

  const renderQRContent = () => (
    <View style={styles.qrContent}>
      <View style={styles.qrHeader}>
        <Text style={styles.qrTitle}>
          {showManualInput ? 'Enter Code' : 'Scan QR Code'}
        </Text>
        <TouchableOpacity onPress={handleCloseQR} style={styles.closeButton}>
          <CloseIcon size={24} color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
      </View>
      
      {showManualInput ? renderManualInput() : renderScanner()}
      
      {!showManualInput && (
        <View style={styles.qrOptions}>
          <TouchableOpacity 
            style={[styles.qrOption, { borderColor: tintColor }]}
            onPress={() => setShowManualInput(true)}
          >
            <KeyIcon size={20} color={tintColor} style={styles.qrOptionIcon} />
            <Text style={[styles.qrOptionText, { color: tintColor }]}>Enter Code</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Text style={styles.qrHelpText}>
        {showManualInput 
          ? 'Enter the assessment code provided by your instructor'
          : 'Point your camera at a QR code to scan automatically'}
      </Text>
    </View>
  );

  const renderDrawer = () => (
    <View style={[styles.drawerContainer, { display: showDrawer ? 'flex' : 'none' }]}>
      <TouchableOpacity 
        style={styles.drawerOverlay}
        activeOpacity={1}
        onPress={closeDrawer}
      />
      <Animated.View 
        style={[
          styles.drawerContent,
          { transform: [{ translateX: drawerAnim }] }
        ]}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/education-logo.png')}
            style={styles.drawerLogo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.quickLinksTitle}>QUICK LINKS</Text>
        
        <DrawerLink 
          Icon={HomeIcon} 
          label="Home" 
          color={tintColor}
          onPress={() => {
            closeDrawer();
          }}
        />
        <DrawerLink 
          Icon={CoursesIcon} 
          label="My Courses" 
          onPress={() => {
            closeDrawer();
          }}
        />
        <DrawerLink 
          Icon={ScheduleIcon} 
          label="Schedule" 
          onPress={() => {
            closeDrawer();
          }}
        />
        <DrawerLink 
          Icon={MessagesIcon} 
          label="Messages" 
          onPress={() => {
            closeDrawer();
          }}
        />
        
        <Text style={styles.quickLinksTitle}>SETTINGS</Text>
        
        <DrawerLink 
          Icon={SettingsIcon} 
          label="Settings" 
          onPress={() => {
            closeDrawer();
          }}
        />
        <DrawerLink 
          Icon={HelpIcon} 
          label="Help & Support" 
          onPress={() => {
            closeDrawer();
          }}
        />
        <DrawerLink 
          Icon={LogoutIcon} 
          label="Logout" 
          onPress={() => {
            closeDrawer();
          }}
        />
      </Animated.View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {!isWeb && <View style={styles.statusBarPadding} />}
      
      {isLargeWeb && renderSidebar()}

      {renderHeader()}

      {renderDrawer()}

      <View style={[styles.contentContainer, isLargeWeb && { marginLeft: 96 }]}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: isLargeWeb ? { display: 'none' } : styles.tabBar,
            tabBarButton: isLargeWeb ? () => null : HapticTab,
            tabBarBackground: isLargeWeb ? undefined : TabBarBackground,
            tabBarLabelStyle: styles.tabLabel,
            tabBarActiveTintColor: tintColor,
            tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => (
                isLoading ? (
                  <Skeleton width={26} height={26} borderRadius={13} />
                ) : (
                  <HomeIcon size={iconSize} color={color} />
                )
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explore',
              tabBarIcon: ({ color }) => (
                isLoading ? (
                  <Skeleton width={26} height={26} borderRadius={13} />
                ) : (
                  <SendIcon size={iconSize} color={color} />
                )
              ),
            }}
          />
          <Tabs.Screen
            name="qr-code"
            options={{
              title: '',
              tabBarIcon: ({ focused }) => (
                isLoading ? (
                  <Skeleton width={62} height={62} borderRadius={31} />
                ) : (
                  <TouchableOpacity
                    style={{
                      ...styles.qrCodeButton,
                      backgroundColor: focused ? tintColor : '#fff',
                      borderColor: tintColor,
                    }}
                    onPress={handleQRPress}
                  >
                    <QrCodeIcon
                      size={qrIconSize}
                      color={focused ? '#fff' : tintColor}
                    />
                  </TouchableOpacity>
                )
              ),
            }}
          />
          <Tabs.Screen
            name="path"
            options={{
              title: 'Path',
              tabBarIcon: ({ color }) => (
                isLoading ? (
                  <Skeleton width={26} height={26} borderRadius={13} />
                ) : (
                  <ArrowUpRightIcon size={iconSize} color={color} />
                )
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color }) => (
                isLoading ? (
                  <Skeleton width={26} height={26} borderRadius={13} />
                ) : (
                  <UserIcon size={iconSize} color={color} />
                )
              ),
            }}
          />
        </Tabs>
      </View>

      {/* Mobile Bottom Sheet */}
      {!isWeb && showQRModal && (
        <>
          <TouchableOpacity 
            style={styles.overlay} 
            activeOpacity={1}
            onPress={handleCloseQR}
          />
          <Animated.View
            style={[
              styles.bottomSheet,
              {
                height: sheetHeight,
                transform: [{ translateY: panY }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.sheetHandle} />
            {renderQRContent()}
          </Animated.View>
        </>
      )}

      {/* Web Modal */}
      {isWeb && showQRModal && (
        <Modal
          visible={showQRModal}
          transparent
          animationType="fade"
          onRequestClose={handleCloseQR}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.webModal}>
              {renderQRContent()}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}