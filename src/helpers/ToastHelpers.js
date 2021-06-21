import Toast from 'react-native-toast-message';

const renderToast = (content, type = 'error') => {
    console.log('content :>> ', content);
    Toast.show({
        type,
        visibilityTime: 2000,
        autoHide: true,
        text1: content || 'Lỗi hệ thống, vui lòng thử lại!',
    });
};

export default { renderToast };
