import { Block, Text } from 'galio-framework';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { IconCustom, NoteText } from '../components/uiComponents';
import { IconFamily, NowTheme, Rx } from '../constants';

export default function Support() {
    const [tabActiveIndex, setTabActiveIndex] = useState(0);

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
                <NoteText
                    width={NowTheme.SIZES.WIDTH_BASE * 0.95}
                    title="Giá trị quy đổi Giá trị quy đổi Giá trị quy đổi Giá trị quy đổi Giá trị quy đổi :"
                    content="1.000 vnd = 1 kim cương"
                    contentStyle={{
                        fontSize: NowTheme.SIZES.FONT_H3,
                        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        alignSelf: 'flex-start'
                    }}
                    backgroundColor={NowTheme.COLORS.LIST_ITEM_BACKGROUND_1}
                />
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
});
