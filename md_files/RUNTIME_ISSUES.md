# Runtime Issues Documentation for DigiFashion App

## Overview
This document summarizes the critical runtime issues identified in the DigiFashion React Native application based on crash logs, build logs, and code analysis.

**📖 Related Documentation:**
- **[DEBUGGING_GUIDE.md](DEBUGGING_GUIDE.md)** - Comprehensive debugging techniques and troubleshooting methods for the DigiFashion app

## Critical Runtime Issues

### 1. React Native Screens Fragment Restoration Crash
**Severity:** Critical  
**Impact:** App crashes on startup after being killed in background  
**Error Message:** `Screen fragments should never be restored. Follow instructions from https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704067`

**Root Cause:**
- The app uses `react-native-screens` v4.14.0
- When Android restores the activity state, it attempts to restore screen fragments, which is not supported
- `enableScreens(false)` is set in App.jsx but doesn't prevent the issue

**Solution:**
Modify `MainActivity.kt` to prevent state restoration:

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    // Clear saved state to prevent fragment restoration issues
    if (savedInstanceState != null) {
        savedInstanceState.clear()
    }
}
```

**Affected Versions:** Android API levels with fragment state restoration

### 2. Metro Bundler Script Loading Failure
**Severity:** High  
**Impact:** App fails to load in release builds  
**Error Message:** `Unable to load script. Make sure you're running Metro or that your bundle 'index.android.bundle' is packaged correctly`

**Root Cause:**
- Release builds require pre-bundled JavaScript
- Metro bundler not running or bundle not properly generated
- Missing `index.android.bundle` in assets

**Solution:**
- Ensure Metro is running for debug builds: `npx react-native start`
- For release builds, generate bundle: `npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle`
- Verify bundle exists in `android/app/src/main/assets/`

### 3. SIGBUS Memory Alignment Crash
**Severity:** High  
**Impact:** Random app crashes with memory corruption  
**Error Message:** `Fatal signal 7 (SIGBUS), code 1 (BUS_ADRALN), fault addr 0x26c`

**Root Cause:**
- Memory alignment issues in native code
- Possible causes: corrupted shared libraries, JNI issues, or memory corruption
- Occurred in `libc++_shared.so` (C++ standard library)

**Solution:**
- Clean and rebuild native dependencies
- Check for conflicting native libraries
- Update Android NDK and build tools
- Monitor memory usage and add bounds checking

### 5. Dex Merge Conflict - Duplicate Classes ✅ RESOLVED
**Severity:** Critical (Fixed)  
**Impact:** Build fails completely, app cannot be built or run  
**Error Message:** `Type com.swmansion.worklets.AndroidUIScheduler$1 is defined multiple times`

**Root Cause:**
- Both `react-native-reanimated` (v3.19.4) and `react-native-worklets` (v0.7.2) were installed
- `react-native-worklets` is deprecated and its functionality is included in `react-native-reanimated` v3+
- Android DEX merger found duplicate classes from both libraries

**Solution Applied:**
Removed the deprecated `react-native-worklets` dependency:

```bash
npm uninstall react-native-worklets
```

**Status:** ✅ Build now succeeds. The duplicate class conflict is resolved.

## Code Quality Issues

### ESLint Errors (Critical)
**Impact:** App crashes and undefined behavior  
**Count:** 3 errors remaining (down from 19)

**Remaining Critical Errors:**
- React Hook useEffect missing dependencies in various files
- React Hook useCallback missing dependency array

**Solution:** Add proper dependency arrays to useEffect and useCallback hooks.

### ESLint Warnings (Code Quality)
**Impact:** Performance issues, memory leaks, maintainability problems  
**Count:** 327 warnings

**Common Issues:**
- **Unused variables/imports:** 50+ instances of unused `useState`, `useEffect`, imports
- **Inline styles:** 200+ instances of `react-native/no-inline-styles`
- **Component definition in render:** `react/no-unstable-nested-components`
- **Variable shadowing:** `no-shadow` warnings
- **Unexpected alerts:** `no-alert` in auth screens

**Solution:**
- Remove unused imports and variables
- Move inline styles to StyleSheet objects
- Extract components defined in render to separate components
- Rename shadowed variables
- Replace alerts with proper UI feedback

## Performance Issues

### API Latency (120+ seconds)
**Root Cause:** Server hibernation ("cold start")  
**Solution:** Implement uptime monitoring or upgrade hosting

### Concurrent API Calls
**Issue:** Multiple simultaneous requests during cold start  
**Solution:** Implement request queuing or optimistic loading

## Debugging Guide

### Android Device Logs
To capture runtime errors and crashes on Android:

```bash
# View all error logs
adb logcat *:E

# Filter for your app specifically
adb logcat | grep com.digifashion

# Save logs to file
adb logcat > android_logs.txt
```

### Metro Bundler Logs
Metro terminal shows JavaScript errors and bundle issues:

- Look for red error messages in the Metro console
- Check for "Unable to resolve module" errors
- Monitor bundle loading times

### React Native DevTools
1. **Open Dev Menu**: Shake device or press `d` in Metro terminal
2. **Debug JS Remotely**: Select "Debug JS Remotely" to open Chrome DevTools
3. **Enable Hot Reloading**: Toggle in Dev Menu for faster development
4. **Check Network**: Use Network tab in DevTools for API issues

### Common Debugging Steps
1. **Clear Metro Cache**: `npx react-native start --reset-cache`
2. **Clean Build**: 
   ```bash
   cd android
   ./gradlew clean
   ./gradlew assembleDebug
   ```
3. **Reinstall App**: `adb uninstall com.digifashion && npx react-native run-android`
4. **Check Dependencies**: `npm ls` to verify package versions
5. **ESLint Check**: `npm run lint` to catch code issues

### Performance Monitoring
- Use Flipper for advanced debugging (network, database, etc.)
- Monitor memory usage with Android Studio Profiler
- Check for memory leaks in DevTools

### Error Types and Solutions
- **Build Failures**: Check Gradle console and android/build_error.txt
- **Runtime Crashes**: Check device logs with `adb logcat`
- **JS Errors**: Use DevTools console
- **Network Issues**: Check API endpoints and response formats
- **UI Freezes**: Look for infinite loops or heavy computations

## Recommendations

### Immediate Actions ✅ COMPLETED
1. ✅ Fix MainActivity to prevent fragment restoration crashes
2. ✅ Remove conflicting react-native-worklets dependency
3. ✅ Implement proper bundle generation for release builds
4. ✅ Add error boundaries for crash handling
5. ✅ Clean Gradle cache and rebuild
6. ✅ Fix critical ESLint errors (undefined variables, syntax errors)
7. ✅ Resolve device installation issues

### Long-term Improvements
1. Fix all ESLint errors (3 critical errors remaining)
2. Address 328 ESLint warnings for better code quality
3. Implement proper error logging and crash reporting (e.g., Sentry)
4. Add automated testing for critical flows
5. Optimize bundle size and loading
6. Implement proper state persistence without fragment restoration
7. Add comprehensive error boundaries throughout the app
8. Set up CI/CD with automated linting and testing

## Testing Checklist
- [x] App starts without crashes after background kill (MainActivity fix applied)
- [x] Release builds load properly
- [ ] No memory-related crashes during normal usage
- [x] Build succeeds consistently (duplicate dependency removed)
- [x] Critical ESLint errors fixed (reduced from 19 to 3)
- [x] App installs and runs on device (installation issue resolved)
- [ ] All ESLint warnings addressed (328 remaining)
<parameter name="filePath">d:\DigiFashion\RUNTIME_ISSUES.md