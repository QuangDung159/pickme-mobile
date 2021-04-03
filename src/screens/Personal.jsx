import {
    Block, Text
} from 'galio-framework';
import React from 'react';
import {
    StyleSheet
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { BookingList, UserInformation, Wallet } from '../components/bussinessComponents';
import { IconCustom } from '../components/uiComponents';
import {
    IconFamily, NowTheme
} from '../constants';
import { setPersonTabActiveIndex } from '../redux/Actions';

export default function Personal({ navigation, route }) {
    const personTabActiveIndex = useSelector((state) => state.appConfigReducer.personTabActiveIndex);

    const dispatch = useDispatch();

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
            )
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
            )
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
            )
        }
    ];

    // Render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderTabButton = (tab, index) => {
        const { tabLabel } = tab;
        return (
            <TouchableWithoutFeedback
                key={tabLabel}
                onPress={() => dispatch(setPersonTabActiveIndex(index))}
                containerStyle={{
                    backgroundColor: !(index === personTabActiveIndex)
                        ? NowTheme.COLORS.LIST_ITEM_BACKGROUND_1
                        : NowTheme.COLORS.BASE,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    height: NowTheme.SIZES.HEIGHT_BASE * 0.07
                }}
            >
                <Text
                    size={12}
                    color={(index === personTabActiveIndex) ? NowTheme.COLORS.ACTIVE : NowTheme.COLORS.DEFAULT}
                    style={styles.titleBold}
                >
                    {tabLabel}
                </Text>
            </TouchableWithoutFeedback>
        );
    };

    const renderTabByIndex = () => {
        switch (personTabActiveIndex) {
            case 0: {
                return (
                    <UserInformation navigation={navigation} />
                );
            }
            case 1: {
                return (
                    <Wallet navigation={navigation} route={route} />
                );
            }
            case 2: {
                return (
                    <BookingList navigation={navigation} />
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
                    height: NowTheme.SIZES.HEIGHT_BASE * 0.08
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
        width: NowTheme.SIZES.WIDTH_BASE * 0.44,
        margin: 0
    },
});
