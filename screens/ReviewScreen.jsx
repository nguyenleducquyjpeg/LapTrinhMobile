import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import firestore from '@react-native-firebase/firestore';

const WriteReviewScreen = ({ route, navigation }) => {
    const { movie } = route.params;
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [userName, setUserName] = useState("");

    const handleSendReview = async () => {
        if (!userName.trim() || !comment.trim()) {
            Alert.alert("Thông báo", "Vui lòng nhập tên và bình luận");
            return;
        }

        try {
            // Thêm review vào mảng reviews của phim
            await firestore()
                .collection("movies")
                .doc(movie.id)
                .update({
                    reviews: firestore.FieldValue.arrayUnion({
                        id: Date.now().toString(), // ID duy nhất cho review
                        user_name: userName,
                        rating: rating,
                        comment: comment,
                        date: new Date().toLocaleDateString('vi-VN'),
                    }),
                });

            Alert.alert("Thành công", "Đánh giá của bạn đã được gửi!");
            navigation.goBack();
        } catch (error) {
            console.error("Lỗi gửi review:", error);
            Alert.alert("Lỗi", "Không thể gửi đánh giá");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Viết đánh giá</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Tên người dùng */}
            <View style={styles.section}>
                <Text style={styles.label}>Tên của bạn</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tên"
                    value={userName}
                    onChangeText={setUserName}
                    placeholderTextColor="#999"
                />
            </View>

            {/* Xếp loại */}
            <View style={styles.section}>
                <Text style={styles.label}>Xếp loại (1-5 sao)</Text>
                <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                            key={star}
                            onPress={() => setRating(star)}
                            style={{ marginRight: 10 }}
                        >
                            <Ionicons
                                name="star"
                                size={40}
                                color={star <= rating ? "#f1c40f" : "#ddd"}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={styles.ratingText}>{rating}/5 sao</Text>
            </View>

            {/* Bình luận */}
            <View style={styles.section}>
                <Text style={styles.label}>Bình luận</Text>
                <TextInput
                    style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
                    placeholder="Viết bình luận của bạn..."
                    multiline
                    value={comment}
                    onChangeText={setComment}
                    placeholderTextColor="#999"
                />
            </View>

            {/* Nút gửi */}
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendReview}>
                <Text style={styles.sendBtnText}>GỬI ĐÁNH GIÁ</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 16 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        paddingTop: 10,
    },
    title: { fontSize: 18, fontWeight: "bold" },
    section: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: "bold", marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
    },
    ratingContainer: { flexDirection: "row", marginBottom: 10 },
    ratingText: { fontSize: 12, color: "#666" },
    sendBtn: {
        backgroundColor: "#b71c1c",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    sendBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default WriteReviewScreen;