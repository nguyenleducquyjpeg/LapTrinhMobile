import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

export const uploadAndSaveAvatar = async (imagePath, uid) => {
    try {
        // Tạo reference tới file trong Firebase Storage
        const filename = `avatars/${uid}_${Date.now()}.jpg`;
        const reference = storage().ref(filename);

        // Upload file
        await reference.putFile(imagePath);

        // Lấy download URL
        const url = await reference.getDownloadURL();

        // Cập nhật Firestore
        await firestore().collection('users').doc(uid).update({
            avatarUrl: url,
            avatarUpdatedAt: new Date().toISOString(),
        });

        return url;
    } catch (error) {
        console.error('Upload avatar error:', error);
        throw error;
    }
};