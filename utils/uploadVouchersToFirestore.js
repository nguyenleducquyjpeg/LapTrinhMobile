import firestore from '@react-native-firebase/firestore';
import { VOUCHERS } from '../data/mock_data';

export const uploadVouchersToFirestore = async () => {
    try {
        const batch = firestore().batch();

        VOUCHERS.forEach((voucher) => {
            const docRef = firestore().collection('vouchers').doc(voucher.id);
            batch.set(docRef, {
                id: voucher.id,
                title: voucher.title,
                description: voucher.description,
                code: voucher.code,
                discount: voucher.discount,
                discountType: voucher.discountType,
                minPrice: voucher.minPrice,
                maxUsage: voucher.maxUsage,
                usageCount: voucher.usageCount,
                expireDate: voucher.expireDate,
                image: voucher.image,
                isUsed: voucher.isUsed,
                createdAt: firestore.FieldValue.serverTimestamp(),
                updatedAt: firestore.FieldValue.serverTimestamp(),
            });
        });

        await batch.commit();
        console.log('✅ Upload vouchers thành công!');
        return true;
    } catch (error) {
        console.error('❌ Lỗi upload vouchers:', error);
        return false;
    }
};