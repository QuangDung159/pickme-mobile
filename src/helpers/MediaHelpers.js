/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { IMAGE_STORAGE_URL, IMGBB_API_KEY } from '@env';
import { RxUtil } from '@utils/index';
import * as ImagePicker from 'expo-image-picker';
import FormData from 'form-data';

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

export default {
    pickImage,
    imgbbUploadImage
};
