# React Native Debugging Guide for DigiFashion App

## Overview
This guide provides comprehensive debugging techniques for the DigiFashion React Native application. Use these methods to identify, diagnose, and resolve issues during development and production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Basic Debugging](#basic-debugging)
3. [Android-Specific Debugging](#android-specific-debugging)
4. [iOS-Specific Debugging](#ios-specific-debugging)
5. [JavaScript Debugging](#javascript-debugging)
6. [Network Debugging](#network-debugging)
7. [Performance Debugging](#performance-debugging)
8. [Common Issues & Solutions](#common-issues--solutions)
9. [Advanced Tools](#advanced-tools)
10. [Best Practices](#best-practices)

## Prerequisites

### Development Environment Setup
- Node.js (v18+)
- React Native CLI
- Android Studio (for Android debugging)
- Xcode (for iOS debugging)
- ADB (Android Debug Bridge)

### Essential Commands
```bash
# Check React Native version
npx react-native --version

# Check device connection
adb devices

# Start Metro bundler
npx react-native start

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
```

## Basic Debugging

### 1. Metro Bundler Logs
The Metro terminal displays real-time information about:
- Bundle compilation
- Module resolution
- JavaScript errors
- Hot reloading status

**Key indicators:**
- Red text = Errors
- Yellow text = Warnings
- Green text = Success messages

### 2. Console Logging
Add logging to your code for debugging:

```javascript
// Basic logging
console.log('Debug message:', variable);

// Error logging
console.error('Error occurred:', error);

// Warning logging
console.warn('Warning:', message);

// Structured logging
console.log('User action:', {
  screen: 'Home',
  action: 'button_press',
  timestamp: new Date().toISOString()
});
```

### 3. React Native Dev Menu
Access the Dev Menu by:
- **Android**: Shake device or press `d` in Metro terminal
- **iOS**: Shake device or Cmd+D in simulator

**Dev Menu Options:**
- Reload: Restart the JavaScript bundle
- Debug JS Remotely: Open Chrome DevTools
- Enable Hot Reloading: Auto-reload on file changes
- Enable Fast Refresh: Faster reloads
- Toggle Inspector: Element inspection
- Show Perf Monitor: Performance metrics

## Android-Specific Debugging

### Device Logs (ADB)
```bash
# View all logs
adb logcat

# View only errors
adb logcat *:E

# Filter by app
adb logcat | grep com.digifashion

# Save logs to file
adb logcat > android_logs.txt

# Real-time filtering
adb logcat -v time | grep -i error
```

### Android Studio Debugging
1. Open Android Studio
2. Open project: `android/` folder
3. Run → Debug 'app'
4. Set breakpoints in Java/Kotlin code
5. Monitor Logcat tab

### Native Crash Analysis
For native crashes, check:
- `android/app/build_error.txt`
- Android Studio Logcat
- Device crash logs via `adb bugreport`

## iOS-Specific Debugging

### Xcode Debugging
1. Open `ios/DigiFashion.xcworkspace`
2. Select simulator or device
3. Run → Debug
4. Use breakpoints and LLDB debugger

### iOS Device Logs
```bash
# View device console
xcrun simctl spawn booted log stream --level debug

# Filter by app
xcrun simctl spawn booted log stream --predicate 'process == "DigiFashion"'
```

### iOS Crash Logs
- Xcode → Window → Devices and Simulators
- Select device → View Device Logs
- Look for `.crash` files

## JavaScript Debugging

### Chrome DevTools
1. Open Dev Menu → Debug JS Remotely
2. Chrome opens at `http://localhost:8081/debugger-ui`
3. Use standard web debugging tools:
   - **Console**: JavaScript logs and errors
   - **Sources**: Set breakpoints in JS code
   - **Network**: Monitor API calls
   - **Application**: Inspect storage, cookies
   - **Performance**: Analyze JS performance

### Breakpoints and Stepping
```javascript
// Conditional breakpoint
if (user.id === 'debug_user') {
  debugger; // Code will pause here
}

// Named breakpoints for easier identification
console.log('🔍 DEBUG: Entering function X');
```

### React DevTools
```bash
# Install globally
npm install -g react-devtools

# Run DevTools
npx react-devtools

# In app, enable inspection
Dev Menu → Toggle Inspector
```

## Network Debugging

### Metro Network Inspection
- Dev Menu → Debug JS Remotely
- Chrome DevTools → Network tab
- Monitor API requests, responses, and timing

### Charles Proxy / Fiddler
For advanced network debugging:
1. Install proxy tool
2. Configure device to use proxy
3. Intercept and analyze network traffic

### API Debugging
```javascript
// Add request/response logging
const apiCall = async (url, options) => {
  console.log('🌐 API Request:', { url, options });
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log('✅ API Response:', { status: response.status, data });
    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
};
```

## Performance Debugging

### React Native Performance Monitor
- Dev Menu → Show Perf Monitor
- Shows: RAM usage, JS thread FPS, UI thread FPS

### Memory Leaks
```javascript
// Check for memory leaks
import { useEffect } from 'react';

const MyComponent = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Memory check:', performance.memory);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ... component code
};
```

### Bundle Analysis
```bash
# Analyze bundle size
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output bundle.android.js --sourcemap-output bundle.android.js.map

# Use bundle analyzer
npm install -g react-native-bundle-analyzer
npx react-native-bundle-analyzer bundle.android.js
```

## Common Issues & Solutions

### 1. Metro Connection Issues
**Symptoms:** "Unable to connect to Metro" or "Connection refused"

**Solutions:**
```bash
# Reset Metro cache
npx react-native start --reset-cache

# Kill Metro process
pkill -f "metro"

# Check port availability
lsof -i :8081
```

### 2. Build Failures
**Symptoms:** Gradle build fails

**Solutions:**
```bash
# Clean build
cd android
./gradlew clean
./gradlew assembleDebug

# Clear Gradle cache
rm -rf ~/.gradle/caches
./gradlew cleanBuildCache
```

### 3. App Crashes on Launch
**Symptoms:** App closes immediately after opening

**Solutions:**
- Check device logs: `adb logcat *:E`
- Verify MainActivity.kt configuration
- Check for missing native dependencies
- Validate React Native version compatibility

### 4. JavaScript Errors
**Symptoms:** Red screen with error message

**Solutions:**
- Check Metro console for stack trace
- Use Chrome DevTools to debug
- Verify import statements
- Check for undefined variables

### 5. Network Request Failures
**Symptoms:** API calls fail

**Solutions:**
- Verify API endpoints
- Check network permissions
- Use Charles Proxy to inspect traffic
- Add timeout and retry logic

### 6. UI Rendering Issues
**Symptoms:** Blank screens or layout problems

**Solutions:**
- Use React DevTools to inspect component tree
- Check for missing keys in lists
- Verify StyleSheet definitions
- Test on different screen sizes

## Advanced Tools

### Flipper
Facebook's debugging platform for React Native:
```bash
# Install Flipper
# Download from https://fbflipper.com/

# Add to React Native app
npm install --save-dev react-native-flipper
```

**Features:**
- Network inspection
- Database browsing
- Layout inspection
- Plugin ecosystem

### React Native Debugger
Standalone debugger with Redux DevTools:
```bash
# Install
brew install react-native-debugger

# Or download from releases
# https://github.com/jhen0409/react-native-debugger/releases
```

### Android Studio Profiler
For native performance analysis:
1. Android Studio → View → Tool Windows → Profiler
2. Run app in debug mode
3. Analyze CPU, Memory, Network usage

## Best Practices

### 1. Logging Strategy
```javascript
// Consistent logging format
const logger = {
  debug: (message, data) => console.log(`🐛 ${message}`, data),
  info: (message, data) => console.info(`ℹ️ ${message}`, data),
  warn: (message, data) => console.warn(`⚠️ ${message}`, data),
  error: (message, error) => console.error(`❌ ${message}`, error)
};

// Usage
logger.debug('User login attempt', { email: user.email });
```

### 2. Error Boundaries
```javascript
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text>Something went wrong!</Text>
          <TouchableOpacity onPress={() => this.setState({ hasError: false })}>
            <Text>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

// Wrap app components
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### 3. Development vs Production Logging
```javascript
// Conditional logging
const isDev = __DEV__;

const devLog = (...args) => {
  if (isDev) console.log(...args);
};

const prodLog = (level, message, data) => {
  if (!isDev) {
    // Send to logging service (Sentry, LogRocket, etc.)
    sendToLoggingService(level, message, data);
  }
};
```

### 4. Performance Monitoring
```javascript
// Measure component render time
import { useEffect, useRef } from 'react';

const useRenderTime = (componentName) => {
  const renderStart = useRef(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    console.log(`${componentName} render time: ${renderTime}ms`);
  });
};

// Usage
const MyComponent = () => {
  useRenderTime('MyComponent');
  // ... component code
};
```

### 5. Automated Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run E2E tests (if configured)
npm run e2e
```

## Troubleshooting Checklist

### Before Starting Debug Session
- [ ] Metro bundler is running
- [ ] Device is connected (`adb devices`)
- [ ] App is installed on device
- [ ] No conflicting processes on ports 8081, 3000, etc.

### During Debug Session
- [ ] Check Metro console for errors
- [ ] Monitor device logs (`adb logcat`)
- [ ] Use DevTools for JavaScript debugging
- [ ] Test on multiple devices/screen sizes
- [ ] Verify network connectivity

### After Resolving Issues
- [ ] Clear Metro cache
- [ ] Rebuild native code if needed
- [ ] Test on clean device install
- [ ] Update documentation
- [ ] Add regression tests

## Resources

### Official Documentation
- [React Native Debugging](https://reactnative.dev/docs/debugging)
- [Metro Bundler](https://facebook.github.io/metro/)
- [Android Debug Bridge](https://developer.android.com/studio/command-line/adb)

### Community Tools
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)
- [React DevTools](https://github.com/facebook/react/tree/main/packages/react-devtools)

### Learning Resources
- [React Native Debugging Guide](https://medium.com/@tunvirrahmantushery/debugging-react-native-apps-7a8f4f4dd722)
- [Android Debugging](https://developer.android.com/studio/debug)
- [iOS Debugging](https://developer.apple.com/documentation/xcode/debugging-your-app)

---

**Last Updated:** January 18, 2026
**Version:** 1.0
**Author:** AI Assistant</content>
<parameter name="filePath">d:\DigiFashion\DEBUGGING_GUIDE.md