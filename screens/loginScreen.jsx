import React from "react";
import {
    View,
    TextInput,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = ({ navigation }) => {
    // Không dùng useContext(AuthContext)
    const handleLogin = () => {
        // Nhấn là chuyển trang, không cần kiểm tra điều kiện
        navigation.navigate("Home");
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.View}>
                <Image
                    source={require("../assets/cgv.png")}
                    style={styles.Image}
                />
                <Text style={[styles.title, { textAlign: 'center' }]}>Login</Text>

                <TextInput placeholder="Username" style={styles.input} />
                <TextInput placeholder="Password" style={styles.input} secureTextEntry />

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <Text style={styles.footerText}>
                    By logging in, you agree to our Terms of Service and Privacy Policy.
                </Text>

                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                    <Text style={styles.link}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    View: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20
    },
    container: {
        padding: 16,
        flex: 1
    },
    Image: {
        width: 64,
        height: 64,
        marginBottom: 16,
        alignSelf: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: "#DFDFDF",
        marginBottom: 16,
        paddingBottom: 8
    },
    loginButton: {
        backgroundColor: "#dc383e",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 16
    },
    buttonText: {
        color: "white",
        fontWeight: "bold"
    },
    footerText: {
        fontSize: 14,
        color: "gray",
        textAlign: "center",
        marginTop: 16
    },
    link: {
        color: "#dc383e",
        textAlign: "center",
        fontWeight: "bold",
        marginTop: 8
    },
});

export default LoginScreen;