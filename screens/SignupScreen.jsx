import React, { useContext, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const SignUpScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNmber] = useState("");
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await signUp({ fullName, email, phoneNumber, username, password });
            // Redirect to another screen, for example, Login or Home
            navigation.navigate("Home"); // Or 'Login'
        } catch (error) {
            setError("Failed to sign up. Please try again.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, justifyContent: "center", paddingBottom: "25%" }}>
                <Image
                    source={require("../assets/cgv.png")}
                    style={{ width: 64, height: 64, marginBottom: 16, alignSelf: "center" }}
                />
                <Text style={styles.title}>Sign Up</Text>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TextInput
                    placeholder="Full Name"
                    style={styles.input}
                    onChangeText={setFullName}
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder="Phone Number"
                    style={styles.input}
                    onChangeText={setPhoneNmber}
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder="Username"
                    style={styles.input}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    secureTextEntry
                    onChangeText={setPassword}
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder="Confirm Password"
                    style={styles.input}
                    secureTextEntry
                    onChangeText={setConfirmPassword}
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    style={{
                        backgroundColor: "#B22222",
                        paddingVertical: 12,
                        borderRadius: 8,
                    }}
                    onPress={handleSignUp}
                >
                    <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Sign Up</Text>
                </TouchableOpacity>

                <Text style={styles.footerText}>By Signing Up, you agree to our Terms & Privacy Policy</Text>

                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.link}>Already have an account? Log In</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 16,
        borderBottomColor: "#DFDFDF",
        paddingBottom: 8,
    },
    footerText: {
        fontSize: 12,
        color: "gray",
        textAlign: "center",
        marginTop: 16,
    },
    link: {
        fontStyle: 14,
        fontWeight: "bold",
        color: "#B71C1C",
        textAlign: "center",
        marginTop: 8,
    },
    error: {
        color: "red",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 10,
    }
});

export default SignUpScreen;
