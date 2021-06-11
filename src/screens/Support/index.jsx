/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { PICKME_INFO_URL } from '@env';
import React, { useEffect, useState } from 'react';
import {
    Image, StyleSheet, Text, View
} from 'react-native';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import { useSelector } from 'react-redux';
import {
    CenterLoader,
    CustomButton, CustomInput, IconCustom, NoteText, TopTabBar
} from '../../components/uiComponents';
import {
    IconFamily, NowTheme, Rx, ScreenName
} from '../../constants';
import { MediaHelpers, ToastHelpers } from '../../helpers';
import { rxUtil } from '../../utils';

export default function Support({ navigation }) {
    const [tabActiveIndex, setTabActiveIndex] = useState(0);
    const [listFAQ, setListFAQ] = useState([]);
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
    const pickMeInfoStore = useSelector((state) => state.appConfigReducer.pickMeInfoStore);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const tabs = [
        {
            tabLabel: 'Câu hỏi thường gặp'
        },
        {
            tabLabel: 'Báo lỗi/hỗ trợ'
        }
    ];

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    useEffect(
        () => {
            if (pickMeInfoStore?.faq) {
                setListFAQ(pickMeInfoStore.faq);
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
            }
        );
    };

    const handleOnPickImageReport = (uri) => {
        setIsShowSpinner(true);
        MediaHelpers.uploadImage(
            uri,
            Rx.USER.UPLOAD_USER_IMAGE,
            token,
            (res) => {
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
            `${Rx.USER.REMOVE_USER_IMAGE}/${imageId}`,
            'POST',
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
        <View
            style={{
                width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                marginVertical: 10,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}
        >
            <CustomButton
                onPress={() => {
                    setBugReportForm({
                        title: '',
                        description: '',
                        url: ''
                    });
                    removeImage();
                }}
                buttonStyle={styles.button}
                type="default"
                label="Huỷ bỏ"
            />
            <CustomButton
                onPress={() => onSubmitBugReport()}
                buttonStyle={styles.button}
                type="active"
                label="Xác nhận"
            />
        </View>
    );

    const renderListFAQ = () => {
        if (listFAQ && listFAQ.length !== 0) {
            return (
                <FlatList
                    data={listFAQ}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View
                            key={item.answer}
                            style={{
                                paddingVertical: 10
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
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                />
            );
        }

        return (
            <View
                style={{
                    alignItems: 'center',
                    marginVertical: 15
                }}
            >
                <Text
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        color: NowTheme.COLORS.SWITCH_OFF,
                        fontSize: NowTheme.SIZES.FONT_H2
                    }}
                >
                    Danh sách trống
                </Text>
            </View>
        );
    };

    const renderTabByIndex = () => {
        if (tabActiveIndex === 0) {
            return (
                <>
                    {renderListFAQ()}
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
        <View
            style={{
                paddingVertical: 10
            }}
        >
            <View
                style={{
                    flexDirection: 'row'
                }}
            >
                <Text
                    style={{
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        color: NowTheme.COLORS.ACTIVE,
                        fontSize: 16,
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
            </View>
        </View>
    );

    const renderBugReportForm = () => (
        <>
            {isShowSpinner ? (
                <CenterLoader />
            ) : (
                <View
                    style={{
                        width: NowTheme.SIZES.WIDTH_BASE * 0.9,
                        alignSelf: 'center',
                        paddingVertical: 10
                    }}
                >
                    {renderInputBugTitle()}
                    {renderInputBugDescription()}
                    {renderUploadImageReportButton()}
                    {renderImageReport()}
                    {renderButtonPanel()}
                </View>
            )}
        </>
    );

    const renderInputBugTitle = () => (
        <CustomInput
            multiline
            placeholder="Nhập tóm tắt lỗi..."
            value={bugReportForm.title}
            onChangeText={(input) => onChangeBugTitle(input)}
            inputStyle={{
                height: 60
            }}
            containerStyle={{
                marginVertical: 10,
                width: NowTheme.SIZES.WIDTH_BASE * 0.9
            }}
            label="Tóm tắt lỗi:"
        />
    );

    const renderInputBugDescription = () => (
        <CustomInput
            multiline
            placeholder="Nhập chi tiết lỗi..."
            value={bugReportForm.description}
            onChangeText={(input) => onChangeDescription(input)}
            inputStyle={{
                height: 60
            }}
            containerStyle={{
                marginVertical: 10,
                width: NowTheme.SIZES.WIDTH_BASE * 0.9
            }}
            label="Chi tiết lỗi:"
        />
    );

    return (
        <>
            {renderImageView()}
            <TopTabBar
                tabs={tabs}
                tabActiveIndex={tabActiveIndex}
                setTabActiveIndex={(index) => setTabActiveIndex(index)}
            />
            {renderTabByIndex()}
        </>
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