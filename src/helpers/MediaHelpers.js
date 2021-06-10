import * as ImagePicker from 'expo-image-picker';
import FormData from 'form-data';
import uuid from 'react-native-uuid';
import { rxUtil } from '../utils';

const uploadImage = (uri, uploadUrl, token, successCallBack, errorCallBack, catchCallBack, imgTitle = 'image') => {
    const myuuid = uuid.v4();
    const filename = `${uri.split('/').pop()}.${myuuid}`;

    // Infer the type of the image
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image';

    // Upload the image using the fetch and FormData APIs
    const formData = new FormData();
    // Assume "file" is the name of the form field the server expects
    formData.append('image', { uri, name: filename, type });
    formData.append('Title', imgTitle);

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

const pickImage = async (allowCrop, uploadAspect, callBack, quality = 0) => {
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

const uploadImageDocument = (uri, uploadUrl, docType, token, successCallBack, errorCallBack, catchCallBack) => {
    const filename = uri.split('/').pop();

    // Infer the type of the image
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image';

    // Upload the image using the fetch and FormData APIs
    const formData = new FormData();
    // Assume "file" is the name of the form field the server expects
    formData.append('image', { uri, name: filename, type });
    formData.append('type', docType);

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

export default {
    uploadImage,
    pickImage,
    removeImage,
    uploadImageDocument
};
