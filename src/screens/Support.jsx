import {
    Block, Button, Input, Text
} from 'galio-framework';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { IconCustom, NoteText } from '../components/uiComponents';
import { IconFamily, NowTheme, Rx } from '../constants';
import { rxUtil } from '../utils';

export default function Support() {
    const [tabActiveIndex, setTabActiveIndex] = useState(0);
    const [listQAN, setListQAN] = useState([]);
    const [bugReportForm, setBugReportForm] = useState({
        title: '',
        description: '',
        url: ''
    });

    const token = useSelector((state) => state.userReducer.token);

    const tabs = [
        {
            tabLabel: 'Câu hỏi thường gặp',
            tabIcon: (
                <IconCustom
                    name="diamond"
                    family={IconFamily.SIMPLE_LINE_ICONS}
                    size={12}
                    color={NowTheme.COLORS.ACTIVE}
                />
            ),
            endpoint: Rx.PARTNER.LEADER_BOARD_DIAMOND
        },
        {
            tabLabel: 'Báo lỗi/hỗ trợ',
            tabIcon: (
                <IconCustom
                    name="clipboard-list"
                    family={IconFamily.FONT_AWESOME_5}
                    size={NowTheme.SIZES.FONT_H4}
                    color={NowTheme.COLORS.ACTIVE}
                />
            ),
            endpoint: Rx.PARTNER.LEADER_BOARD_BOOKING
        }
    ];

    useEffect(
        () => {
            getListQNA();
        }, []
    );

    const getListQNA = () => {
        rxUtil(
            Rx.SYSTEM.GET_QNA,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setListQAN(res.data.data);
            },
            () => {},
            () => {}
        );
    };

    const onChangeDesctiption = (desctionInput) => {
        setBugReportForm({ ...bugReportForm, description: desctionInput });
    };

    const onChangeBugTitle = (titleInput) => {
        setBugReportForm({ ...bugReportForm, title: titleInput });
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
                onPress={() => {
                    // onSubmitBooking();
                }}
                shadowless
                style={styles.button}
            >
                Xác nhận
            </Button>

            <Button
                onPress={() => {
                    // renderAlert();
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

    const renderBugReportForm = () => (
        <>
            {renderInputBugTitle()}
            {renderInputBugDescription()}
            {renderButtonPanel()}
        </>
    );

    const renderInputBugTitle = () => (
        <Block
            middle
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
            middle
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

    const renderTopButton = (tab, index) => {
        const { tabLabel } = tab;
        return (
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
                    {tabLabel}
                </Text>
            </TouchableWithoutFeedback>

        );
    };

    return (
        <Block
            flex
            style={{
                alignItems: 'center',
            }}
        >
            <Block
                row
                style={[{
                    height: NowTheme.SIZES.HEIGHT_BASE * 0.06
                }]}
            >
                {tabs.map((tab, index) => renderTopButton(tab, index))}
            </Block>
            <ScrollView
                contentContainerStyle={{
                    width: NowTheme.SIZES.WIDTH_BASE * 0.95,
                    paddingVertical: 10
                }}
            >
                {renderTabByIndex()}
            </ScrollView>
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
