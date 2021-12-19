import { RxUtil } from '@utils/index';
import * as ImagePicker from 'expo-image-picker';
import FormData from 'form-data';
import { getConfigByEnv } from './CommonHelpers';

const { IMAGE_STORAGE_URL, IMGBB_API_KEY } = getConfigByEnv();

const imgbbUploadImage = async (uri, onSuccess, onFail) => {
    const filename = `${uri.split('/').pop()}`;

    // Infer the type of the image
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image';

    // Upload the image using the fetch and FormData APIs
    const formData = new FormData();
    // Assume "file" is the name of the form field the server expects
    formData.append('image', { uri, name: filename, type });
    formData.append('key', IMGBB_API_KEY);

    const headers = {
        'content-type': 'multipart/form-data',
    };

    const result = await RxUtil(
        '/upload',
        'POST',
        formData,
        IMAGE_STORAGE_URL,
        headers
    );

    const { data } = result;
    if (data) {
        onSuccess(data);
    } else {
        onFail(data);
    }
};

const pickImage = async (allowCrop, uploadAspect, callBack, quality = 1) => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: allowCrop,
        aspect: uploadAspect,
        quality,
    });

    if (!result.cancelled) {
        callBack(result);
    }
};

const removeImage = async (removeUrl, onSuccess, onFail) => {
    const result = await RxUtil(
        removeUrl,
        'POST'
    );

    const { data } = result;

    if (data) {
        onSuccess(data);
    } else {
        onFail(data);
    }
};

export default {
    pickImage,
    imgbbUploadImage,
    removeImage
};
