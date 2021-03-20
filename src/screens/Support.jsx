import {
    Block, Button, Input, Text
} from 'galio-framework';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import { useSelector } from 'react-redux';
import { CenterLoader, IconCustom, NoteText } from '../components/uiComponents';
import { IconFamily, NowTheme, Rx } from '../constants';
import { MediaHelpers, ToastHelpers } from '../helpers';
import { rxUtil } from '../utils';

export default function Support() {
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

    const token = useSelector((state) => state.userReducer.token);

    const tabs = ['Câu hỏi thường gặp', 'Báo lỗi/hỗ trợ'];

    useEffect(
        () => {
            getListQNA();
        }, []
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
            () => {
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            }
        );
    };

    const onChangeDesctiption = (desctionInput) => {
        setBugReportForm({ ...bugReportForm, description: desctionInput });
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
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            },
            () => {
                setIsShowSpinner(false);
            }
        );
    };

    const handleOnPickImageReport = (uri) => {
        console.log('uri :>> ', uri);
        setBugReportForm({ ...bugReportForm, url: uri });
        setImage(uri);
    };

    const onClickUploadImageReport = () => {
        MediaHelpers.pickImage(true, [1, 1], (result) => handleOnPickImageReport(result.uri));
    };

    const renderImageReport = () => (
        <TouchableWithoutFeedback
            onPress={() => {
                setVisible(true);
                setListImageReview([{ url: bugReportForm.url }]);
            }}
        >
            {/* <Image
                source={{
                    uri: `file://${RNFS.DocumentDirectoryPath}Users/quangdunglu/Library/Developer/CoreSimulator/Devices/9BD6C292-C9FA-439E-89B5-13C34FA0DEFD/data/Containers/Data/Application/082491AC-4FFD-4CD0-8E7D-3E49D677326A/Library/Caches/ExponentExperienceData/%2540quangdunglu159%252Fcustomer-pick-me-mobile-v1/ImagePicker/36C68008-8020-4627-AF16-432E28D3D3C7.jpg`
                }}
            /> */}
            <Text>{image}</Text>
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
                width: NowTheme.SIZES.WIDTH_BASE * 0.95,
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
                onPress={() => setBugReportForm({
                    title: '',
                    description: '',
                    url: ''
                })}
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
                                width={NowTheme.SIZES.WIDTH_BASE * 0.95}
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
                    onChangeText={(input) => onChangeDesctiption(input)}
                />
            </Block>
        </Block>
    );

    const changeTabIndexActive = (tabIndex) => {
        setTabActiveIndex(tabIndex);
    };

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
                <CenterLoader size="large" />
            ) : (
                <>
                    {renderImageView()}
                    <Block
                        row
                        style={[{
                            height: NowTheme.SIZES.HEIGHT_BASE * 0.06
                        }]}
                    >
                        {tabs.map((title, index) => renderTopButton(title, index))}
                    </Block>
                    <ScrollView
                        contentContainerStyle={{
                            width: NowTheme.SIZES.WIDTH_BASE * 0.95,
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
        width: NowTheme.SIZES.WIDTH_BASE * 0.45,
        margin: 0
    },
    input: {
        borderRadius: 5,
        width: NowTheme.SIZES.WIDTH_BASE * 0.95,
    }
});
