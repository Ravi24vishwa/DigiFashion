# Android Build and Runtime Issues Analysis

## Overview
This document analyzes the issues preventing `react-native run-android` from working properly and the app crashes observed in the DigiFashion React Native project.

## Issues Identified

### 1. Build Failures (Intermittent)
**Symptoms:**
- Gradle build fails with "Could not resolve all artifacts for configuration 'classpath'"
- Errors for `com.android.tools.build:gradle`, `com.facebook.react:react-native-gradle-plugin`, and `org.jetbrains.kotlin:kotlin-gradle-plugin`
- Build sometimes succeeds, sometimes fails

**Root Cause:**
- Network connectivity issues preventing artifact downloads from Maven repositories
- Gradle cache corruption or incomplete downloads
- Possible proxy/firewall blocking artifact repositories

**Solutions:**
1. Clear Gradle cache: `cd android && ./gradlew cleanBuildCache`
2. Delete `.gradle` directory: `rm -rf ~/.gradle`
3. Check internet connection and proxy settings
4. Retry the build multiple times
5. Use `--offline` flag if dependencies are cached: `npx react-native run-android --offline`

### 2. App Crash on Startup - Fragment Restoration Issue
**Symptoms:**
- App crashes immediately on launch with `IllegalStateException: Screen fragments should never be restored`
- Error originates from `com.swmansion.rnscreens.ScreenFragment`
- Stack trace shows fragment instantiation failure

**Root Cause:**
- React Native Screens library (v4.14.0) fragments are being restored by Android's activity lifecycle
- Screen fragments don't support state restoration and throw this error when attempted

**Solution:**
Modify `MainActivity.kt` to prevent fragment state restoration:

```kotlin
package com.digifashion

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

    override fun getMainComponentName(): String = "DigiFashion"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null) // Pass null to prevent fragment restoration
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
```

**Note:** This fix disables state restoration for all fragments. While necessary for react-native-screens, ensure no other fragments in your app rely on saved state.

### 3. App Crash - Metro Bundle Loading Issue
**Symptoms:**
- App crashes with "Unable to load script. Make sure you're running Metro"
- Error about missing `index.android.bundle` for release

**Root Cause:**
- Metro bundler server is not running when attempting to run the app
- For debug builds, Metro must be started to serve the JavaScript bundle

**Solution:**
Always start Metro before running Android:

1. Terminal 1: `npm start` or `npx react-native start`
2. Terminal 2: `npx react-native run-android`

For release builds, the bundle should be pre-built, but this error suggests a debug build without Metro.

### 4. Build Failure - react-native-pager-view Codegen Issues
**Symptoms:**
- Build fails with "Unresolved reference 'RNCViewPagerManagerDelegate'" and "Unresolved reference 'RNCViewPagerManagerInterface'"
- Compilation errors in `PagerViewViewManager.kt`
- Methods like 'setScrollEnabled' reported as "overrides nothing"

**Root Cause:**
- React Native codegen generates the required interfaces, but they are not accessible to the pager-view module during compilation
- Possible incompatibility between react-native-pager-view v7.0.2 and React Native 0.80.2
- Codegen output may not be properly included in the module's classpath

**Solutions:**
1. Run codegen manually: `npx react-native codegen`
2. Clean build cache: `cd android && ./gradlew cleanBuildCache`
3. Check for pager-view updates compatible with RN 0.80
4. **Resolved:** Removed unused `react-native-pager-view` package as it was not imported/used in the codebase

## Additional Observations

### Lint Issues
- Multiple ESLint warnings for unused variables and inline styles
- No critical errors, but code cleanup recommended
- Run `npm run lint` to see full output

### Project Configuration
- React Native 0.80.2
- Gradle 8.11.1 with AGP 8.1.1
- Firebase integration (auth, firestore)
- Multiple navigation libraries (react-navigation, react-native-screens)

## Recommended Workflow

1. **Start Metro:** `npm start`
2. **Clear caches if needed:** `cd android && ./gradlew clean`
3. **Run Android:** `npx react-native run-android`
4. **If build fails:** Retry, clear caches, check network

## Resolution Summary

All identified issues have been resolved:

1. **Fragment Restoration Crash**: Fixed by modifying `MainActivity.kt` to prevent fragment state restoration.
2. **Metro Bundle Loading**: Resolved by ensuring Metro is started before running Android.
3. **Build Failures**: Intermittent issues resolved through cache clearing and retries.
4. **Pager-View Codegen Issues**: Resolved by removing the unused `react-native-pager-view` package.

The app now builds successfully and installs on Android devices without crashes.

## Prevention Measures

- Ensure stable internet connection during builds
- Consider using a local Maven proxy if network issues persist
- Keep dependencies updated to latest stable versions
- Monitor for react-native-screens updates that may fix the fragment issue</content>
<parameter name="filePath">d:\DigiFashion\ANDROID_ISSUES_ANALYSIS.md