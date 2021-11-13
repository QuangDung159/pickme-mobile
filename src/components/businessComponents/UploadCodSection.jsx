/* eslint-disable max-len */
import {
    CustomButton, CustomModal, CustomText, IconCustom, RadioButton
} from '@components/uiComponents';
import DocumentType from '@constants/DocumentType';
import IconFamily from '@constants/IconFamily';
import Theme from '@constants/Theme';
import VerificationStatus from '@constants/VerificationStatus';
import MediaHelpers from '@helpers/MediaHelpers';
import ToastHelpers from '@helpers/ToastHelpers';
import { setVerificationStore } from '@redux/Actions';
import UserServices from '@services/UserServices';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ImageScalable from 'react-native-scalable-image';
import { useDispatch, useSelector } from 'react-redux';

const {
    FONT: {
        TEXT_REGULAR,
    },
    SIZES,
    COLORS
} = Theme;

let verificationArray = [];

export default function UploadCodSection({ setIsShowSpinner, navigation }) {
    const [faceUrl, setFaceUrl] = useState('');
    const [frontUrl, setFrontUrl] = useState('');
    const [backUrl, setBackUrl] = useState('');
    const [isForPartnerVerify, setIsForPartnerVerify] = useState(false);
    const [modalInfoVisible, setModalInfoVisible] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const verificationStore = useSelector((state) => state.userReducer.verificationStore);
    // const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

    useEffect(
        () => {
            if (!verificationStore?.verificationDocuments || verificationStore.verificationDocuments.length === 0) {
                fetchVerification();
            } else {
                fillImageFromAPI(verificationStore.verificationDocuments);
            }
        }, []
    );

    const fetchVerification = async () => {
        const result = await UserServices.fetchVerificationAsync();
        const { data } = result;

        if (data) {
            dispatch(setVerificationStore(data.data));
            const listDocUrl = data.data.verificationDocuments;
            fillImageFromAPI(listDocUrl);
        }
    };

    const fillImageFromAPI = (listDocs) => {
        if (!listDocs || !listDocs.length === 0) return false;

        listDocs.forEach((docItem) => {
            const docImage = docItem.url;
            switch (docItem.type) {
                case DocumentType.FACE_IMAGE: {
                    setFaceUrl(docImage);
                    break;
                }
                case DocumentType.DRIVER_FRONT: {
                    setFrontUrl(docImage);
                    break;
                }
                case DocumentType.DRIVER_BACK: {
                    setBackUrl(docImage);
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return true;
    };

    const onPickVerificationDoc = (docType) => {
        MediaHelpers.pickImage(
            false,
            [4, 3],
            (result) => {
                handleOnPickVerificationDoc(result.uri, docType);
            },
            0.6
        );
    };

    const handleOnPickVerificationDoc = (uri, docType) => {
        switch (docType) {
            case DocumentType.FACE_IMAGE: {
                setFaceUrl(uri);
                break;
            }
            case DocumentType.DRIVER_FRONT: {
                setFrontUrl(uri);
                break;
            }
            case DocumentType.DRIVER_BACK: {
                setBackUrl(uri);
                break;
            }
            default: {
                break;
            }
        }
    };

    const renderUploadDocForm = (docType, buttonText) => {
        let isDisabled = false;
        if (currentUser.verifyStatus !== VerificationStatus.NONE
            && currentUser.verifyStatus !== VerificationStatus.REJECT) {
            isDisabled = true;
        }
        return (
            <View style={{
                alignItems: 'center',
            }}
            >
                <CustomButton
                    onPress={() => onPickVerificationDoc(docType)}
                    type="active"
                    label={buttonText}
                    buttonStyle={{
                        width: SIZES.WIDTH_BASE * 0.9,
                        marginBottom: 10
                    }}
                    labelStyle={{
                        fontFamily: TEXT_REGULAR,
                        fontSize: SIZES.FONT_H4
                    }}
                    disabled={isDisabled}
                />
            </View>
        );
    };

    const renderDocSection = () => (
        <View
            style={{
                marginVertical: 10
            }}
        >
            {renderUploadDocForm(DocumentType.FACE_IMAGE, 'Ảnh chụp cá nhân')}
            {renderDocImageByType(DocumentType.FACE_IMAGE, faceUrl)}
            <View
                style={styles.docFormContainer}
            >
                {renderUploadDocForm(DocumentType.DRIVER_FRONT, 'Ảnh chụp cá nhân')}
                {renderDocImageByType(DocumentType.DRIVER_FRONT, frontUrl)}
            </View>
            <View
                style={styles.docFormContainer}
            >
                {renderUploadDocForm(DocumentType.DRIVER_BACK, 'Thẻ xanh COVID')}
                {renderDocImageByType(DocumentType.DRIVER_BACK, backUrl)}
            </View>
        </View>
    );
    const onSubmitUploadList = () => {
        if (!(backUrl && faceUrl && frontUrl)) {
            ToastHelpers.renderToast('Vui lòng chọn đủ hình ảnh');
            return;
        }

        setIsShowSpinner(true);
        setTimeout(() => {
            navigation.goBack();
            // onGetCurrentUserData();
            ToastHelpers.renderToast('Tải lên thành công.', 'success');
        }, 5000);

        uploadDoc(DocumentType.FACE_IMAGE, faceUrl);
        uploadDoc(DocumentType.DRIVER_FRONT, frontUrl);
        uploadDoc(DocumentType.DRIVER_BACK, backUrl);
    };

    const uploadDoc = (docType, imageLocalUrl) => {
        MediaHelpers.imgbbUploadImage(
            imageLocalUrl,
            (res) => {
                const verifyItem = {
                    url: res.data.url,
                    type: docType
                };

                verificationArray.push(verifyItem);
                if (verificationArray.length === 3) {
                    const result = UserServices.addVerifyDocAsync({
                        verifyNote: isForPartnerVerify ? 'Xác thực tài khoản Host' : 'xác thực tài khoản khách hàng',
                        documents: verificationArray
                    });
                    const { data } = result;

                    if (data) {
                        verificationArray = [];
                    }
                }
            },
            () => {
                ToastHelpers.renderToast();
                setIsShowSpinner(false);
            }
        );
    };

    const renderButtonPanel = () => {
        if (currentUser.verifyStatus === VerificationStatus.NONE) {
            return (
                <View
                    style={{
                        paddingVertical: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >
                    <CustomButton
                        onPress={() => {
                            navigation.goBack();
                        }}
                        type="default"
                        label="Huỷ bỏ"
                    />
                    <CustomButton
                        onPress={() => onSubmitUploadList()}
                        type="active"
                        label="Xác nhận"
                    />
                </View>
            );
        }
        return null;
    };

    const renderDocImageByType = (docType, imageUrl) => {
        if (imageUrl === '') {
            return (
                <View
                    style={{
                        alignItems: 'center',
                        marginVertical: 15
                    }}
                >
                    <CustomText text="Chưa có ảnh" />
                </View>
            );
        }

        return (
            <View
                style={{
                    alignSelf: 'center'
                }}
            >
                <ImageScalable
                    style={{
                        zIndex: 99
                    }}
                    width={SIZES.WIDTH_BASE * 0.9}
                    source={{ uri: imageUrl }}
                />
            </View>
        );
    };

    const renderInfoModal = () => (
        <CustomModal
            modalVisible={modalInfoVisible}
            renderContent={() => (
                <>
                    <CustomText
                        style={{
                            width: SIZES.WIDTH_BASE * 0.8,
                            color: COLORS.DEFAULT,
                        }}
                        text='Nếu bạn chọn "Xác thực người dùng", bạn sẽ có đầy đủ các tính năng khách hàng của PickMe như nhắn tin, đặt hẹn,...'
                    />
                    <CustomText
                        style={{
                            width: SIZES.WIDTH_BASE * 0.8,
                            color: COLORS.DEFAULT,
                        }}
                        text='Nếu bạn chọn "Đăng kí Host", bạn sẽ có đầy đủ các tính năng khách hàng của PickMe như nhắn tin, đặt hẹn,..., và các chức năng của Host như nhận đơn hẹn, thêm thu nhập,...'
                    />

                    <View
                        style={{
                            width: SIZES.WIDTH_BASE * 0.8,
                            marginVertical: 10,
                            alignSelf: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <CustomButton
                            onPress={() => setModalInfoVisible(false)}
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.39
                            }}
                            type="default"
                            label="Tôi đã hiểu"
                        />
                    </View>
                </>
            )}
        />
    );

    try {
        return (
            <View
                style={{
                    marginTop: 10
                }}
            >
                {renderInfoModal()}
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start'
                    }}
                    onPress={() => setModalInfoVisible(true)}
                >
                    <CustomText
                        text="Chọn mục đích: "
                    />
                    <IconCustom
                        name="info-circle"
                        family={IconFamily.FONT_AWESOME}
                        size={14}
                        color={COLORS.ACTIVE}
                    />
                </TouchableOpacity>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <RadioButton
                        label="Xác thực người dùng"
                        selected={!isForPartnerVerify}
                        onPress={() => setIsForPartnerVerify(false)}
                    />
                    <RadioButton
                        label="Đăng kí Host"
                        selected={isForPartnerVerify}
                        onPress={() => setIsForPartnerVerify(true)}
                    />
                </View>
                <View
                    style={{
                        marginTop: 10,
                        backgroundColor: COLORS.BASE,
                    }}
                >
                    {renderDocSection()}
                </View>
                {renderButtonPanel()}
            </View>
        );
    } catch (exception) {
        console.log('exception :>> ', exception);
        return (
            <>
                {ToastHelpers.renderToast()}
            </>
        );
    }
}

const styles = StyleSheet.create({
    docFormContainer: {
        marginTop: 30
    }
});
