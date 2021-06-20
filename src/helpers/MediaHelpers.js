import RxUtil from '@utils/Rx.Util';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import FormData from 'form-data';

const uploadImage = async (uri, uploadUrl, onSuccess, onFail, imgTitle = 'image') => {
    const apiTokenLocal = await SecureStore.getItemAsync('api_token');
    const filename = `${uri.split('/').pop()}`;

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
        Authorization: apiTokenLocal
    };

    const result = await RxUtil(
        uploadUrl,
        'POST',
        formData,
        undefined,
        headers
    );

    const { data } = result;

    if (data) {
        onSuccess(data);
    } else {
        onFail(data);
    }
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

const uploadImageDocument = async (uri, uploadUrl, onSuccess, onFail, docType) => {
    const apiTokenLocal = await SecureStore.getItemAsync('api_token');
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
        Authorization: apiTokenLocal
    };

    const result = await RxUtil(
        uploadUrl,
        'POST',
        formData,
        undefined,
        headers
    );

    const { data } = result;

    if (data) {
        onSuccess(data);
    } else {
        onFail(data);
    }
};

export default {
    uploadImage,
    pickImage,
    uploadImageDocument
};
