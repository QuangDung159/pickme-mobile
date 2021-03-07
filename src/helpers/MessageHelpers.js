/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
import ToastHelpers from './ToastHelpers';

const showMessageNotification = (
    prevMessage,
    receivedMessage,
    currentScreenName,
    exceptScreenName
) => {
    try {
        if (currentScreenName !== exceptScreenName
        && prevMessage?._id !== receivedMessage?._id) {
            ToastHelpers.renderToast('Bạn có tin nhắn mới', 'success');
        }
    } catch (ex) {
        console.log('ex', ex);
    }
};

export default { showMessageNotification };
