import * as ImagePicker from 'expo-image-picker';
import FormData from 'form-data';
import { Alert, Platform } from 'react-native';
import { rxUtil } from '../utils';

const uploadImage = (uri, uploadUrl, token, successCallBack, errorCallBack, catchCallBack) => {
    const filename = uri.split('/').pop();

    // Infer the type of the image
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image';

    // Upload the image using the fetch and FormData APIs
    const formData = new FormData();
    // Assume "file" is the name of the form field the server expects
    formData.append('image', { uri, name: filename, type });

    const headers = {
        'content-type': 'multipart/form-data',
        Authorization: token
    };

    rxUtil(
        uploadUrl,
        'POST',
        formData,
        headers,
        successCallBack,
        errorCallBack,
        catchCallBack
    );
};

const removeImage = (removeUrl, headers, successCallBack, failCallBack, catchCallBack) => {
    rxUtil(
        removeUrl,
        'DELETE',
        null,
        headers,
        successCallBack,
        failCallBack,
        catchCallBack
    );
};

const pickImage = async (allowCrop, uploadAspect, callBack) => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: allowCrop,
        aspect: uploadAspect,
        quality: 0.2,
    });

    if (!result.cancelled) {
        callBack(result);
    }
};

export default {
    uploadImage,
    pickImage,
    removeImage
};
