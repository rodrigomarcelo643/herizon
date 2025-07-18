import {
  Platform,
  StatusBar,
  StyleSheet, 
} from 'react-native';
import { Colors } from '@/constants/Colors';

export const createStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];
  const isIOS = Platform.OS === 'ios';

  return StyleSheet.create({
    statusBarPadding: {
      height: StatusBar.currentHeight,
      backgroundColor: colors.background,
    },
    header: {
      position: 'absolute',
      top: isIOS ? 0 : StatusBar.currentHeight,
      right: 0,
      left: 0,
      height: 60,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      zIndex: 10,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    userInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    userTextContainer: {
      alignItems: 'flex-start',
    },
    userName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    userBadge: {
      backgroundColor: colors.tint,
      borderRadius: 3,
      paddingHorizontal: 4,
      paddingVertical: 1,
      marginTop: 2,
      alignSelf: 'flex-start',
    },
    userBadgeText: {
      fontSize: 10,
      paddingBottom: 2,
      textAlign: 'center',
      color: '#fff',
    },
    notificationButton: {
      position: 'relative',
    },
    notificationBadge: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'red',
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    contentContainer: {
      flex: 1,
      marginTop: 60,
    },
    tabBar: {
      position: 'absolute',
      height: isIOS ? 88 : 78,
      borderTopWidth: 0,
      elevation: 0,
      paddingBottom: isIOS ? 6 : 4,
      width: '100%',
    },
    sidebar: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 96,
      backgroundColor: colors.background,
      borderRightWidth: 1,
      borderColor: '#ddd',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 20,
      zIndex: 999,
    },
    logoContainer: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 30,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    logo: {
      width: 48,
      height: 48,
      marginBottom: 8,
    },
    logoTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.tint,
      textAlign: 'center',
    },
    sidebarGroup: {
      width: '100%',
      alignItems: 'center',
    },
    sidebarItem: {
      marginVertical: 8,
      alignItems: 'center',
      paddingVertical: 12,
    },
    sidebarLabel: {
      fontSize: 11,
      marginTop: 4,
      textAlign: 'center',
      color: '#999',
    },
    tabLabel: {
      fontSize: 11,
    },
    qrCodeButton: {
      top: 0,
      width: 62,
      height: 62,
      borderRadius: 31,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      borderWidth: 2,
    },
    qrCodeSidebar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      marginVertical: 20,
      alignSelf: 'center',
    },
    qrContent: {
      flex: 1,
      padding: 5,
    },
    qrHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    qrTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    closeButton: {
      padding: 8,
    },
    qrOptions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 30,
    },
    qrOption: {
      paddingVertical: 15,
      paddingHorizontal: 25,
      borderRadius: 30,
      borderWidth: 2,
      flexDirection: 'row',
      alignItems: 'center',
    },
    qrOptionText: {
      fontWeight: '600',
    },
    qrOptionIcon: {
      marginRight: 8,
    },
    qrHelpText: {
      textAlign: 'center',
      color: '#888',
      marginTop: 10,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    webModal: {
      borderRadius: 20,
      padding: 25,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 20,
      backgroundColor: colors.background,
      maxWidth: 500,
      width: '80%',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1001,
    },
    bottomSheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 20,
      paddingHorizontal: 20,
      zIndex: 1002,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 20,
      backgroundColor: colors.background,
    },
    sheetHandle: {
      width: 40,
      height: 5,
      backgroundColor: '#ccc',
      borderRadius: 2.5,
      alignSelf: 'center',
      marginBottom: 20,
    },
    cameraContainer: {
      flex: 1,
      width: '100%',
      height: '75%',
      overflow: 'hidden',
      borderRadius: 20,
      marginBottom: 20,
    },
    camera: {
      flex: 1,
      width: '100%',
    },
    scannerOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scannerFrame: {
      width: '80%',
      height: '60%',
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.5)',
      position: 'relative',
    },
    corner: {
      position: 'absolute',
      width: 30,
      height: 30,
      borderColor: colors.tint,
      borderWidth: 4,
    },
    topLeftCorner: {
      top: -2,
      left: -2,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      borderTopLeftRadius: 10,
    },
    topRightCorner: {
      top: -2,
      right: -2,
      borderLeftWidth: 0,
      borderBottomWidth: 0,
      borderTopRightRadius: 10,
    },
    bottomLeftCorner: {
      bottom: -2,
      left: -2,
      borderRightWidth: 0,
      borderTopWidth: 0,
      borderBottomLeftRadius: 10,
    },
    bottomRightCorner: {
      bottom: -2,
      right: -2,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      borderBottomRightRadius: 10,
    },
    scannerControls: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    controlButton: {
      padding: 15,
      borderRadius: 30,
      backgroundColor: 'rgba(0,0,0,0.7)',
      marginHorizontal: 10,
    },
    scanAgainButton: {
      backgroundColor: colors.tint,
    },
    scanAgainText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    manualInputContainer: {
      flex: 1,
      padding: 20,
      width: '100%',
    },
    manualInputHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    backButtonText: {
      marginLeft: 5,
      fontWeight: '600',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      paddingHorizontal: 15,
      marginBottom: 20,
    },
    inputIcon: {
      marginRight: 10,
    },
    codeInput: {
      flex: 1,
      height: 50,
      fontSize: 16,
      color: colors.text,
    },
    submitButton: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: colors.tint,
    },
    submitButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    webScannerPlaceholder: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    webScannerText: {
      marginTop: 20,
      color: colors.text,
      textAlign: 'center',
    },
    permissionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    permissionText: {
      color: colors.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    permissionButton: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: colors.tint,
    },
    permissionButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },


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
    width: '50%',
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
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  drawerLabel: {
    marginLeft: 15,
    fontSize: 14,
    fontWeight: '500',
  },
  menuButton: {
    padding: 5,
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
  logoContainer1: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 10,
  },
  drawerLogo: {
    width: 30,
    height: 30,
  },
  });
};