import { Block, Button, Text } from 'galio-framework';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImageScalable from 'react-native-scalable-image';
import { useDispatch, useSelector } from 'react-redux';
import {
    CenterLoader, Line
} from '../components/uiComponents';
import { NowTheme, Rx, ScreenName } from '../constants';
import { MediaHelpers, ToastHelpers } from '../helpers';
import { setVerificationStore } from '../redux/Actions';
import { rxUtil } from '../utils';

let count = 0;

export default function Verification({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [faceUrl, setFaceUrl] = useState('');
    const [frontUrl, setFrontUrl] = useState('');
    const [backUrl, setBackUrl] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const token = useSelector((state) => state.userReducer.token);
    const verificationStore = useSelector((state) => state.userReducer.verificationStore);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

    const headers = {
        Authorization: token
    };

    useEffect(
        () => {
            if (!verificationStore) {
                fetchVerification();
            } else {
                fillImageFromAPI(verificationStore.verificationDocuments);
            }
        }, []
    );

    useEffect(
        () => {
            if (isSignInOtherDeviceStore) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: ScreenName.SIGN_IN_WITH_OTP }],
                });
            }
        }, [isSignInOtherDeviceStore]
    );

    const fetchVerification = () => {
        rxUtil(
            Rx.USER.GET_VERIFICATION_DETAIL,
            'GET',
            null,
            headers,
            (res) => {
                dispatch(setVerificationStore(res.data.data));
                fillImageFromAPI(res.data.data.verificationDocuments);
            }
        );
    };

    const renderUploadDocForm = (docType, buttonText) => (
        <Block style={{
            alignItems: 'center',
        }}
        >
            <Block>
                <Button
                    color={NowTheme.COLORS.BLOCK}
                    fontSize={NowTheme.SIZES.FONT_H3}
                    style={{
                        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                    }}
                    onPress={
                        () => onPickVerificationDoc(docType)
                    }
                    textStyle={{
                        color: NowTheme.COLORS.ACTIVE
                    }}
                    shadowless
                    disabled={(verificationStore && verificationStore.verifyStatus === 'InProcess')}
                >
                    {buttonText}
                </Button>
            </Block>
        </Block>
    );

    const renderDocSecion = () => (
        <>
            {renderUploadDocForm(0, 'Ảnh chụp cá nhân')}
            {renderDocImageByType(0, faceUrl)}
            <Block
                style={styles.docFormContainer}
            >
                {renderUploadDocForm(1, 'Mặt trước CMND/CCCD/bằng lái xe còn thời hạn')}
                {renderDocImageByType(1, frontUrl)}
            </Block>
            <Block
                style={styles.docFormContainer}
            >
                {renderUploadDocForm(2, 'Mặt sau CMND/CCCD/bằng lái xe còn thời hạn')}
                {renderDocImageByType(2, backUrl)}
            </Block>
        </>
    );

    const fillImageFromAPI = (listDocs) => {
        if (!listDocs || !listDocs.length === 0) return false;

        listDocs.forEach((docItem) => {
            const docImage = docItem.url;
            switch (docItem.type) {
                case 'FaceImage': {
                    setFaceUrl(docImage);
                    break;
                }
                case 'DriverFont': {
                    setFrontUrl(docImage);
                    break;
                }
                case 'DriverBack': {
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
            0.1
        );
    };

    const handleOnPickVerificationDoc = (uri, docType) => {
        switch (docType) {
            case 0: {
                setFaceUrl(uri);
                break;
            }
            case 1: {
                setFrontUrl(uri);
                break;
            }
            case 2: {
                setBackUrl(uri);
                break;
            }
            default: {
                break;
            }
        }
    };

    const submitVerificationRequest = () => {
        rxUtil(
            Rx.USER.SUBMIT_VERIFICATION,
            'POST',
            null,
            headers
        );
    };

    const uploadDoc = (docType, imageLocalUrl) => {
        MediaHelpers.uploadImageDocument(
            imageLocalUrl,
            Rx.USER.UPLOAD_VERIFICATION_DOC,
            docType,
            token,
            () => {
                count += 1;
                if (count === 3) {
                    submitVerificationRequest();
                }
            }
        );
    };

    const onSubmitUploadList = () => {
        setIsShowSpinner(true);
        setTimeout(() => {
            navigation.goBack();
            ToastHelpers.renderToast('Tải lên thành công.', 'success');
        }, 5000);
        uploadDoc(0, faceUrl);
        uploadDoc(1, frontUrl);
        uploadDoc(2, backUrl);
    };

    const renderButtonPanel = () => {
        if (verificationStore) {
            const { verifyStatus } = verificationStore;
            return (
                <>
                    {(verifyStatus === 'None' || verifyStatus === 'Reject') && (
                        <Block
                            row
                            space="between"
                            style={{
                                paddingVertical: 10,
                                marginTop: 10
                            }}
                        >
                            <Button
                                shadowless
                                onPress={() => onSubmitUploadList()}
                                style={styles.button}
                            >
                                Xác nhận
                            </Button>
                            <Button
                                shadowless
                                color={NowTheme.COLORS.DEFAULT}
                                style={styles.button}
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            >
                                Huỷ bỏ
                            </Button>
                        </Block>
                    )}
                </>
            );
        }
        return null;
    };

    const renderDocImageByType = (docType, imageUrl) => {
        if (imageUrl === '') {
            return (
                <Block
                    style={{
                        alignItems: 'center',
                        marginVertical: 15
                    }}
                >
                    <Text
                        color={NowTheme.COLORS.SWITCH_OFF}
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        }}
                        size={NowTheme.SIZES.FONT_H2}
                    >
                        Chưa có ảnh
                    </Text>
                </Block>
            );
        }

        return (
            <Block
                center
            >
                <ImageScalable
                    style={{
                        zIndex: 99
                    }}
                    width={NowTheme.SIZES.WIDTH_BASE * 0.9}
                    source={{ uri: imageUrl }}
                />
            </Block>
        );
    };

    const renderModalCompleteUpload = () => (
        <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <Block style={styles.centeredView}>
                    <Block style={styles.modalView}>
                        <Text
                            size={NowTheme.SIZES.FONT_H2}
                            color={NowTheme.COLORS.ACTIVE}
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
                                marginVertical: 10,
                                textAlign: 'center'
                            }}
                        >
                            Cảm ơn bạn đã hoàn thành tải lên
                        </Text>
                        <Text
                            size={NowTheme.SIZES.FONT_H2}
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                marginVertical: 10,
                                textAlign: 'center'
                            }}
                        >
                            {/* eslint-disable-next-line max-len */}
                            Chúng tôi sẽ tiến hành quá trình xác thực tài khoản của bạn dựa trên những hình ảnh bạn tải lên.
                        </Text>
                        <Text
                            size={NowTheme.SIZES.FONT_H2}
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                marginVertical: 10,
                                textAlign: 'center'
                            }}
                        >
                            {/* eslint-disable-next-line max-len */}
                            Quá trình này sẽ mất một khoảng thời gian, chúng tôi sẽ sớm có thông báo về tình trạng tài khoản của bạn.
                        </Text>
                        <Block center>
                            <Button
                                onPress={() => {
                                    setModalVisible(false);
                                    navigation.goBack();
                                }}
                                style={{ marginVertical: 10 }}
                                shadowless
                            >
                                Đóng
                            </Button>
                        </Block>
                    </Block>
                </Block>
            </ScrollView>
        </Modal>
    );

    try {
        return (
            <>
                {isShowSpinner ? (
                    // eslint-disable-next-line max-len
                    <CenterLoader size="large" content={`Quá trình tải lên mất nhiều thời gian do chất lượng hình ảnh. Bạn vui lòng đợi nhé ${'<3'}!`} />
                ) : (
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                            alignSelf: 'center'
                        }}
                    >
                        {renderModalCompleteUpload()}
                        <Block>
                            <Block
                                style={{
                                    marginVertical: 10,
                                    backgroundColor: NowTheme.COLORS.BASE,
                                }}
                            >
                                <Block
                                    row
                                    style={{
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={{
                                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                        marginVertical: 10
                                    }}
                                    >
                                        TẢI LÊN CHỨNG TỪ XÁC THỰC
                                    </Text>
                                </Block>
                                <Line
                                    borderWidth={0.5}
                                    borderColor={NowTheme.COLORS.ACTIVE}
                                />
                                {renderDocSecion()}
                            </Block>
                        </Block>

                        {renderButtonPanel()}

                    </KeyboardAwareScrollView>
                )}
            </>
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
    button: {
        margin: 0,
        width: NowTheme.SIZES.WIDTH_BASE * 0.44
    },
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: NowTheme.SIZES.HEIGHT_BASE * 0.3
    },
    modalView: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    docFormContainer: {
        marginTop: 30
    }
});
