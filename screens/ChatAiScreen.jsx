import React, { useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import { GoogleGenerativeAI } from "@google/generative-ai";


const ChatAiScreen = ({ navigation }) => {
    const API_KEY = "AIzaSyCMUmhxmzy1ZO-q-UB5uDJD3VsFpbQdLf8";
    const genAI = new GoogleGenerativeAI(API_KEY);
    const [messages, setMessages] = useState([
        { id: '1', text: 'Chào mày! Tao là CGV AI. Tao giúp gì cho mày?', sender: 'ai' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef();

    const handleSend = async () => {
        if (inputText.trim() === '') return;

        // Hiển thị tin nhắn của người dùng ngay lập tức
        const userMessage = { id: Date.now().toString(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);

        const userText = inputText; // Lưu lại nội dung để gửi cho AI
        setInputText('');
        setIsTyping(true);

        try {
            // 2. Thiết lập Model 
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            // 3. Tạo "Prompt" để định hướng AI (System Instruction)
            const prompt = `Trả lời cho tao: ${userText}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const aiText = response.text();

            // 4. Cập nhật tin nhắn của AI vào giao diện
            const aiResponse = {
                id: (Date.now() + 1).toString(),
                text: aiText,
                sender: 'ai'
            };
            setMessages(prev => [...prev, aiResponse]);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

        } catch (error) {
            console.error("Lỗi gọi Gemini:", error);
            Alert.alert("Lỗi", "Hình như có vấn đề về kết nối mạng hoặc API Key rồi mày ơi!");
        } finally {
            setIsTyping(false);
        }
    };

    const renderMessage = ({ item }) => (
        <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.messageText, item.sender === 'user' ? styles.userText : styles.aiText]}>
                {item.text}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>CGV AI Assistant</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.chatList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {isTyping && (
                <View style={styles.typingContainer}>
                    <ActivityIndicator size="small" color="#b80000" />
                    <Text style={styles.typingText}>Chờ tao đang suy nghĩ...</Text>
                </View>
            )}

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
                <View style={styles.inputArea}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập câu hỏi của bạn..."
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        autoCorrect={false}
                        spellCheck={false}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Ionicons name="send" size={24} color="#b80000" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', elevation: 2, alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#b80000' },
    chatList: { padding: 15, paddingBottom: 20 },
    messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 15, marginBottom: 10 },
    userBubble: { alignSelf: 'flex-end', backgroundColor: '#b80000', borderBottomRightRadius: 2 },
    aiBubble: { alignSelf: 'flex-start', backgroundColor: '#fff', borderBottomLeftRadius: 2, elevation: 1 },
    messageText: { fontSize: 15 },
    userText: { color: '#fff' },
    aiText: { color: '#333' },
    typingContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10, alignItems: 'center' },
    typingText: { fontSize: 12, color: '#666', marginLeft: 8, },
    inputArea: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee' },
    input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, maxHeight: 100, fontSize: 15 },
    sendButton: { marginLeft: 10, padding: 5 }
});

export default ChatAiScreen;