import Toast from 'react-native-toast-message';

const renderToast = (content = 'Lỗi hệ thống, vui lòng thử lại!', type = 'error') => {
    Toast.show({
        type,
        visibilityTime: 2000,
        autoHide: true,
        text1: content,
    });
};

export default { renderToast };
