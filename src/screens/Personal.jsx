import {
    Block, Text
} from 'galio-framework';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { UserInformation } from '../components/bussinessComponents';
import { IconCustom } from '../components/uiComponents';
import {
    IconFamily, NowTheme, Rx
} from '../constants';

export default function Personal({ navigation, route }) {
    const [tabActiveIndex, setTabActiveIndex] = useState(0);

    const tabs = [
        {
            tabLabel: 'Cá nhân',
            tabIcon: (
                <IconCustom
                    name="user-circle-o"
                    family={IconFamily.FONT_AWESOME}
                    size={12}
                    color={NowTheme.COLORS.ACTIVE}
                />
            ),
            endpoint: Rx.PARTNER.LEADER_BOARD_DIAMOND
        },
        {
            tabLabel: 'Rương kim cương',
            tabIcon: (
                <IconCustom
                    name="treasure-chest"
                    family={IconFamily.MATERIAL_COMMUNITY_ICONS}
                    size={NowTheme.SIZES.FONT_H4}
                    color={NowTheme.COLORS.ACTIVE}
                />
            ),
            endpoint: Rx.PARTNER.LEADER_BOARD_BOOKING
        },
        {
            tabLabel: 'Đơn hẹn',
            tabIcon: (
                <IconCustom
                    name="clipboard-list"
                    family={IconFamily.FONT_AWESOME_5}
                    size={NowTheme.SIZES.FONT_H4}
                    color={NowTheme.COLORS.ACTIVE}
                />
            ),
            endpoint: Rx.PARTNER.LEADER_BOARD_LIKE
        }
    ];

    // Render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    useEffect(
        () => {
            if (route?.params?.tabActiveIndex) {
                setTabActiveIndex(route.params.tabActiveIndex);
            }
        }, [route]
    );

    const renderTabButton = (tab, index) => {
        const { tabLabel } = tab;
        return (
            <TouchableWithoutFeedback
                key={tabLabel}
                onPress={() => setTabActiveIndex(index)}
                containerStyle={{
                    backgroundColor: !(index === tabActiveIndex)
                        ? NowTheme.COLORS.LIST_ITEM_BACKGROUND_1
                        : NowTheme.COLORS.BASE,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 3
                }}
            >
                <Text
                    size={12}
                    color={(index === tabActiveIndex) ? NowTheme.COLORS.ACTIVE : NowTheme.COLORS.DEFAULT}
                    style={styles.titleBold}
                >
                    {tabLabel}
                </Text>
            </TouchableWithoutFeedback>
        );
    };

    const renderTabByIndex = () => {
        switch (tabActiveIndex) {
            case 0: {
                return (
                    <UserInformation navigation={navigation} />
                );
            }
            default: {
                return null;
            }
        }
    };

    return (
        <Block flex>
            <Block
                row
                style={[{
                    height: NowTheme.SIZES.HEIGHT_BASE * 0.06
                }]}
            >
                {tabs.map((title, index) => renderTabButton(title, index))}
            </Block>
            {renderTabByIndex()}
        </Block>

    );
}

const styles = StyleSheet.create({
    titleBold: {
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
        fontSize: NowTheme.SIZES.FONT_H4,
        textAlign: 'center'
    },
    button: {
        width: NowTheme.SIZES.WIDTH_BASE * 0.45,
        margin: 0
    },
});
