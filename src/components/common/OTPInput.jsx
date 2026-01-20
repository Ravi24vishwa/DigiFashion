import React, { useRef, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const OtpInput = ({ length = 6, onChangeOTP }) => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(Array(length).fill(""));

  const handleChange = (text, index) => {
    // console.log(text)
    // console.log(index)
    // handle paste of full code
    if (text.length > 1) {
      const pasted = text.slice(0, length).split("");
      setOtp(pasted);
      onChangeOTP && onChangeOTP(pasted.join(""));
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    onChangeOTP && onChangeOTP(newOtp.join(""));

  };

  const handleBackspace = (key, index) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((value, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          value={value}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          autoFocus={index === 0}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={({ nativeEvent: { key } }) => handleBackspace(key, index)}
          caretHidden={true}
        // selectionColor={'#000'}
        />
      ))}
    </View>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
    alignSelf: "center",
    marginVertical: 20,
    // gap: 18,
    // backgroundColor: 'red'
  },
  input: {
    width: 55,
    height: 55,
    textAlign: "center",
    fontSize: 32,
    fontWeight: "600",
    borderColor: "#000",
    borderRadius: 50,
    backgroundColor: 'white',
    color: 'black',
    // borderWidth: 1
  },
});
