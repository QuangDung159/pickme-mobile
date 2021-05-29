/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { PICKME_INFO_URL } from '@env';
import {
    Block, Button, Input, Text
} from 'galio-framework';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import { useSelector } from 'react-redux';
import { CenterLoader, IconCustom, NoteText } from '../components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '../constants';
import { MediaHelpers, ToastHelpers } from '../helpers';
import { rxUtil } from '../utils';

export default function Support({ navigation }) {
    const [tabActiveIndex, setTabActiveIndex] = useState(0);
    const [listQAN, setListQAN] = useState([]);
    const [bugReportForm, setBugReportForm] = useState({
        title: '',
        description: '',
        url: ''
    });
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [listImageReview, setListImageReview] = useState([]);
    const [image, setImage] = useState();
    const [visible, setVisible] = useState(false);
    const [imageId, setImageId] = useState('');

    const token = useSelector((state) => state.userReducer.token);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const tabs = ['Câu hỏi thường gặp', 'Báo lỗi/hỗ trợ'];

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    useEffect(
        () => {
            getListQNA();
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

    const getListQNA = () => {
        setIsShowSpinner(true);
        rxUtil(
            Rx.SYSTEM.GET_QNA,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setListQAN(res.data.data);
                setIsShowSpinner(false);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
            },
            PICKME_INFO_URL
        );
    };

    const onChangeDescription = (descriptionInput) => {
        setBugReportForm({ ...bugReportForm, description: descriptionInput });
    };

    const onChangeBugTitle = (titleInput) => {
        setBugReportForm({ ...bugReportForm, title: titleInput });
    };

    const onSubmitBugReport = () => {
        setIsShowSpinner(true);
        rxUtil(
            Rx.SYSTEM.CREATE_BUG,
            'POST',
            bugReportForm,
            {
                Authorization: token
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'success');
                setBugReportForm({
                    title: '',
                    description: '',
                    url: ''
                });
                setImageId('');
                setImage();
                setIsShowSpinner(false);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
            },
            PICKME_INFO_URL
        );
    };

    const handleOnPickImageReport = (uri) => {
        setIsShowSpinner(true);
        MediaHelpers.uploadImage(
            uri,
            Rx.USER.UPLOAD_PROFILE_IMAGE,
            token,
            (res) => {
                ToastHelpers.renderToast(
                    res?.data?.message || 'Tải ảnh lên thành công!', 'success'
                );
                setIsShowSpinner(false);
                setImage(uri);
                setImageId(res.data.data.id);
                setBugReportForm({ ...bugReportForm, url: res.data.data.url });
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

    const onClickUploadImageReport = () => {
        MediaHelpers.pickImage(true, [1, 1], (result) => handleOnPickImageReport(result.uri));
    };

    const removeImage = () => {
        rxUtil(
            `${Rx.USER.REMOVE_PROFILE_IMAGE}/${imageId}`,
            'DELETE',
            null,
            {
                Authorization: token
            },
            () => {
                setImageId('');
                setImage();
            },
            (res) => ToastHelpers.renderToast(res.data.message, 'error'),
            (res) => ToastHelpers.renderToast(res.data.message, 'error'),
            PICKME_INFO_URL
        );
    };

    const changeTabIndexActive = (tabIndex) => {
        setTabActiveIndex(tabIndex);
    };

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderImageReport = () => (
        <TouchableWithoutFeedback
            onPress={() => {
                setVisible(true);
                setListImageReview([{ url: bugReportForm.url }]);
            }}
        >
            {image && (
                <Image
                    style={styles.imageReport}
                    source={{ uri: image }}
                />
            )}
        </TouchableWithoutFeedback>
    );

    const renderImageView = () => {
        const listImageObj = [];

        listImageReview.forEach((item) => {
            listImageObj.push({
                uri: item.url
            });
        });

        if (visible) {
            return (
                <ImageView
                    images={listImageObj}
                    imageIndex={0}
                    visible={visible}
                    onRequestClose={() => setVisible(false)}
                />
            );
        }
        return <></>;
    };

    const renderButtonPanel = () => (
        <Block
            row
            space="between"
            style={{
                width: NowTheme.SIZES.WIDTH_BASE * 0.9,
            }}
        >
            <Button
                onPress={() => onSubmitBugReport()}
                shadowless
                style={styles.button}
            >
                Xác nhận
            </Button>

            <Button
                onPress={() => {
                    setBugReportForm({
                        title: '',
                        description: '',
                        url: ''
                    });
                    removeImage();
                }}
                shadowless
                style={styles.button}
                color={NowTheme.COLORS.DEFAULT}
            >
                Huỷ bỏ
            </Button>
        </Block>
    );

    const renderListQNA = () => {
        if (listQAN && listQAN.length !== 0) {
            return (
                <>
                    {listQAN.map((item) => (
                        <Block
                            key={item.id}
                            style={{
                                marginBottom: 10
                            }}
                        >
                            <NoteText
                                width={NowTheme.SIZES.WIDTH_BASE * 0.9}
                                title={`${item.question}?`}
                                content={item.answer || 'N/A'}
                                contentStyle={{
                                    fontSize: NowTheme.SIZES.FONT_H3,
                                    fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                    alignSelf: 'flex-start'
                                }}
                                backgroundColor={NowTheme.COLORS.LIST_ITEM_BACKGROUND_2}
                            />
                        </Block>
                    ))}
                </>
            );
        }
        return null;
    };

    const renderTabByIndex = () => {
        if (tabActiveIndex === 0) {
            return (
                <>
                    {renderListQNA()}
                </>
            );
        }
        return (
            <>
                {renderBugReportForm()}
            </>
        );
    };

    const renderUploadImageReportButton = () => (
        <Block
            style={{
                paddingVertical: 10
            }}
        >
            <Block row>
                <Text
                    color={NowTheme.COLORS.ACTIVE}
                    size={16}
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                    }}
                >
                    Ảnh chụp màn hình:
                </Text>

                <TouchableWithoutFeedback
                    onPress={() => onClickUploadImageReport()}
                    containerStyle={{
                        justifyContent: 'center',
                        marginLeft: 10
                    }}
                >
                    <IconCustom
                        name="photo-camera"
                        family={IconFamily.MATERIAL_ICONS}
                        color={NowTheme.COLORS.DEFAULT}
                        size={20}
                    />
                </TouchableWithoutFeedback>
            </Block>
        </Block>
    );

    const renderBugReportForm = () => (
        <>
            {renderInputBugTitle()}
            {renderInputBugDescription()}
            {renderUploadImageReportButton()}
            {renderImageReport()}
            {renderButtonPanel()}
        </>
    );

    const renderInputBugTitle = () => (
        <Block
            style={{
                paddingTop: 10
            }}
        >

            <Block>
                <Text
                    color={NowTheme.COLORS.ACTIVE}
                    size={16}
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                    }}
                >
                    Tóm tắt lỗi:
                </Text>

                <Input
                    numberOfLines={2}
                    style={[
                        styles.input,
                        {
                            height: 44
                        }
                    ]}
                    color={NowTheme.COLORS.HEADER}
                    placeholder="Nhập tóm tắt lỗi..."
                    value={bugReportForm.title}
                    onChangeText={(input) => onChangeBugTitle(input)}
                />
            </Block>
        </Block>
    );

    const renderInputBugDescription = () => (
        <Block
            style={{
                paddingTop: 10
            }}
        >

            <Block>
                <Text
                    color={NowTheme.COLORS.ACTIVE}
                    size={16}
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
                    }}
                >
                    Chi tiết lỗi:
                </Text>

                <Input
                    multiline
                    numberOfLines={2}
                    style={[
                        styles.input,
                        {
                            height: 60
                        }
                    ]}
                    color={NowTheme.COLORS.HEADER}
                    placeholder="Nhập chi tiết lỗi..."
                    value={bugReportForm.description}
                    onChangeText={(input) => onChangeDescription(input)}
                />
            </Block>
        </Block>
    );

    const renderTopButton = (title, index) => (
        <TouchableWithoutFeedback
            onPress={() => changeTabIndexActive(index)}
            containerStyle={{
                backgroundColor: !(index === tabActiveIndex)
                    ? NowTheme.COLORS.LIST_ITEM_BACKGROUND_1
                    : NowTheme.COLORS.BASE,
                flex: 3,
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Text
                color={(index === tabActiveIndex) ? NowTheme.COLORS.ACTIVE : NowTheme.COLORS.DEFAULT}
                style={styles.titleBold}
            >
                {title}
            </Text>
        </TouchableWithoutFeedback>

    );

    return (
        <Block
            flex
            style={{
                alignItems: 'center',
            }}
        >
            {isShowSpinner ? (
                <CenterLoader />
            ) : (
                <>
                    {renderImageView()}
                    <Block
                        row
                        style={[{
                            height: NowTheme.SIZES.HEIGHT_BASE * 0.07
                        }]}
                    >
                        {tabs.map((title, index) => renderTopButton(title, index))}
                    </Block>
                    <ScrollView
                        contentContainerStyle={{
                            width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                            paddingVertical: 10
                        }}
                    >
                        {renderTabByIndex()}
                    </ScrollView>
                </>
            )}
        </Block>
    );
}

const styles = StyleSheet.create({
    shadow: {
        backgroundColor: NowTheme.COLORS.BASE,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.2,
        elevation: 3
    },
    titleBold: {
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
        fontSize: NowTheme.SIZES.FONT_H4
    },
    button: {
        width: NowTheme.SIZES.WIDTH_BASE * 0.44,
        margin: 0
    },
    input: {
        borderRadius: 5,
        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
    },
    imageReport: {
        width: NowTheme.SIZES.WIDTH_BASE * 0.25,
        height: NowTheme.SIZES.WIDTH_BASE * 0.25,
        marginBottom: 10
    },
});
