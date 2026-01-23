# Project Lifecycle & Error Handling Documentation

This document explains the standard patterns for component lifecycle management (Mounting, Updating, Unmounting) and Error Handling within the DigiFashion project, using the `EmailVerificationScreen` as a primary reference.

---

## 1. Component Lifecycle Management

We use React Functional Components with `useEffect` and `useState` hooks to manage the lifecycle.

### A. Mounting Phase (`onMount`)
When a component first appears on the screen, we use `useEffect` with an empty dependency array `[]`.

**Example in `EmailVerificationScreen`:**
```javascript
useEffect(() => {
    // This runs ONLY once when the screen mounts
    GoogleSignin.configure({
        webClientId: '612975934664-agpmvj7u3hgdpbd9r97gt4o31h7o0q1u.apps.googleusercontent.com',
        offlineAccess: true,
    });
}, []);
```

### B. Updating Phase (`onUpdate`)
This occurs when state or props change. We can either react to these changes in the render body or via `useEffect` with dependencies.

**State Update Example:**
```javascript
const [email, setEmail] = useState('');

// Triggered by User Interaction
<TextInput
    value={email}
    onChangeText={(text) => {
        setEmail(text); // Updates the 'email' state, triggering a re-render
        if (emailError) setEmailError(''); // Resets error state on update
    }}
/>
```

### C. Unmounting Phase (`onUnmount`)
To clean up resources (like timers, listeners, or subscriptions), we return a function from `useEffect`.

**Pattern:**
```javascript
useEffect(() => {
    const subscription = someAPI.subscribe();

    return () => {
        // Runs when the component is removed from the DOM/Navigation stack
        subscription.unsubscribe();
    };
}, []);
```

---

## 2. Error Handling Patterns

Robust error handling is implemented at three levels: Local Validation, API Service, and Redux Thunks.

### A. Local Validation Errors
Before sending data to the server, we validate it locally to provide instant feedback.

**Example:**
```javascript
const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
    if (!value) return 'Email is required';
    if (!emailRegex.test(value)) return 'Enter a valid email address';
    return '';
};

// Logic in handleSendOtp
const error = validateEmail(email);
if (error) {
    setEmailError(error); // Show inline error
    Toast.show({ type: 'error', text1: 'Error', text2: error }); // Show popup toast
    return;
}
```

### B. API Service Level Errors
Our global `apiService.js` handles HTTP-level errors (400, 500) and transforms them into standard JavaScript Errors with custom data attached.

### C. Async/Redux Thunk Errors
When calling asynchronous actions, we handle the outcome using `fulfilled` or `rejected` matches.

**Example:**
```javascript
const resultAction = await dispatch(sendOtp(email));

if (sendOtp.fulfilled.match(resultAction)) {
    // Success Case: Navigate forward
    navigation.navigate('SignUpScreen', { email });
} else {
    // Error Case: Show backend error message
    Alert.alert('Error', resultAction.payload?.message || 'Failed to send OTP');
}
```

### D. Try-Catch Global Blocks
For external library calls (like Google Sign-In) which might throw unexpected exceptions, we use `try...catch...finally`.

**Example:**
```javascript
const onGoogleButtonPress = async () => {
    try {
        setLocalLoading(true);
        const signInResult = await GoogleSignin.signIn();
        // ... logic
    } catch (err) {
        // Handle cancellation or library error
        Alert.alert('Google Login Error', err.message);
    } finally {
        setLocalLoading(false); // Ensure loading state is reset regardless of outcome
    }
};
```

---

## Summary Table

| Feature | Implementation | Goal |
| :--- | :--- | :--- |
| **Lifecycle** | `useEffect(fn, [])` | Initialize config/listeners |
| **Feedback** | `Toast.show(...)` | Quick, non-blocking alerts |
| **Critical Errors** | `Alert.alert(...)` | Blocking messages for mandatory fixes |
| **Backend Feedback** | `resultAction.payload` | Specifically typed error messages from server |
| **Resource Safety** | `try...finally` | Always reset loading/cleaning states |
