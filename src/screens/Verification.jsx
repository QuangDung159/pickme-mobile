import { Block, Button, Text } from 'galio-framework';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImageScalable from 'react-native-scalable-image';
import { useDispatch, useSelector } from 'react-redux';
import {
    CenterLoader, IconCustom, Line, NoteText
} from '../components/uiComponents';
import {
    IconFamily, NowTheme, Rx
} from '../constants';
import { MediaHelpers, ToastHelpers } from '../helpers';
import { setVerificationIdStore } from '../redux/Actions';
import { rxUtil } from '../utils';

let count = 0;
const listDocsToUpload = [];

export default function Verification({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [faceUrl, setFaceUrl] = useState('');
    const [frontUrl, setFrontUrl] = useState('');
    const [backUrl, setBackUrl] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [verification, setVerification] = useState();

    const token = useSelector((state) => state.userReducer.token);
    const verificationIdStore = useSelector((state) => state.userReducer.verificationIdStore);

    const dispatch = useDispatch();

    const headers = {
        Authorization: token
    };

    useEffect(
        () => {
            if (verificationIdStore !== '') {
                rxUtil(
                    `${Rx.USER.GET_VERIFICATION_DETAIL}/${verificationIdStore}`,
                    'GET',
                    null,
                    headers,
                    (res) => {
                        setVerification(res.data.data);
                        fillImageFromAPI(res.data.data.documents);
                    }
                );
            }
        }, []
    );

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
                    disabled={verification.status === 'InProcess'}
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
            (result) => handleOnPickVerificationDoc(result.uri, docType),
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

    const uploadDoc = (imageLocalUrl, docType) => {
        setIsShowSpinner(true);
        // uploading is a background work, we want to active spinner 8s,
        // and the app can be use normally during background work is run
        setTimeout(() => {
            ToastHelpers.renderToast('Tải ảnh lên thành công', 'success');
            setModalVisible(true);
            setIsShowSpinner(false);
        }, 5000);

        MediaHelpers.uploadImage(
            imageLocalUrl,
            Rx.USER.UPLOAD_VERIFICATION_DOC,
            token,
            (res) => {
                listDocsToUpload.push({
                    url: res.data.data.url,
                    type: docType
                });

                count += 1;
                if (count === 3) {
                    createVerificationRequest();
                }
            },
            (err) => {
                ToastHelpers.renderToast(
                    err?.data?.message || 'Tải ảnh lên thất bại! Vui lòng thử lại.', 'error'
                );
                setIsShowSpinner(false);
            },
            () => {
                ToastHelpers.renderToast('Tải ảnh lên thất bại! Vui lòng thử lại.', 'error');
                setIsShowSpinner(false);
            }
        );
    };

    const createVerificationRequest = () => {
        const data = {
            description: 'Xác thực tài khoản khách hàng',
            isAcceptCondition: true,
            documents: listDocsToUpload
        };

        rxUtil(
            Rx.USER.CREATE_VERIFICATION_REQUEST,
            'POST',
            data,
            headers,
            (res) => {
                dispatch(setVerificationIdStore(res.data.data.id));
            },
            () => {
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            }
        );
    };

    const onSubmitUploadList = () => {
        uploadDoc(faceUrl, 0);
        uploadDoc(frontUrl, 1);
        uploadDoc(backUrl, 2);
    };

    const renderButtonPanel = () => (
        <>
            {verification.status !== 'InProcess' && (
                <Block
                    row
                    space="between"
                    style={{
                        paddingVertical: 10,
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

                                <Block
                                    style={{
                                        marginVertical: 10
                                    }}
                                >
                                    {verification.status === 'InProcess' ? (
                                        <NoteText
                                            width={NowTheme.SIZES.WIDTH_BASE * 0.9}
                                            title="Quá trình xác thực đang được tiến hành"
                                            // eslint-disable-next-line max-len
                                            content="Quá trình này sẽ mất một khoảng thời gian, chúng tôi sẽ sớm có thông báo về tình trạng tài khoản của bạn."
                                            contentStyle={{
                                                fontSize: NowTheme.SIZES.FONT_H4,
                                                color: NowTheme.COLORS.ACTIVE,
                                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                                marginTop: 5
                                            }}
                                            iconComponent={(
                                                <IconCustom
                                                    name="info-circle"
                                                    family={IconFamily.FONT_AWESOME}
                                                    size={16}
                                                    color={NowTheme.COLORS.ACTIVE}
                                                />
                                            )}
                                            backgroundColor={NowTheme.COLORS.LIST_ITEM_BACKGROUND_1}
                                        />
                                    ) : (
                                        <NoteText
                                            width={NowTheme.SIZES.WIDTH_BASE * 0.9}
                                            title="Tài khoản bạn chưa được xác thực"
                                            // eslint-disable-next-line max-len
                                            content={'Tài khoản chưa xác thực sẽ bị giới hạn một số chức năng.\nBạn vui lòng tải lên những chứng từ bên dưới để chúng tôi có thể xác thực tài khoản cho bạn một cách nhanh chóng. Xin cảm ơn.'}
                                            contentStyle={{
                                                fontSize: NowTheme.SIZES.FONT_H4,
                                                color: NowTheme.COLORS.ACTIVE,
                                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                                marginTop: 5
                                            }}
                                            iconComponent={(
                                                <IconCustom
                                                    name="info-circle"
                                                    family={IconFamily.FONT_AWESOME}
                                                    size={16}
                                                    color={NowTheme.COLORS.ACTIVE}
                                                />
                                            )}
                                            backgroundColor={NowTheme.COLORS.LIST_ITEM_BACKGROUND_1}
                                        />
                                    )}
                                </Block>

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
