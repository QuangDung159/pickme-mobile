import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { NowTheme } from '../../../constants';

const { FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    }, SIZES, COLORS } = NowTheme;

export default function TopTabBar({ tabs, tabActiveIndex, setTabActiveIndex }) {
    const renderTabButton = (tab, index) => {
        const { tabLabel } = tab;

        return (
            <TouchableWithoutFeedback
                key={tabLabel}
                onPress={() => setTabActiveIndex(index)}
                containerStyle={{
                    backgroundColor: !(index === tabActiveIndex)
                        ? COLORS.LIST_ITEM_BACKGROUND_1
                        : COLORS.BASE,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    height: 45
                }}
            >
                <Text
                    style={
                        [
                            styles.titleBold,
                            {
                                fontSize: SIZES.FONT_H4,
                                color: (index === tabActiveIndex) ? COLORS.ACTIVE : COLORS.DEFAULT
                            }
                        ]
                    }
                >
                    {tabLabel}
                </Text>
            </TouchableWithoutFeedback>
        );
    };

    return (
        <View
            style={{
                height: 45,
                flexDirection: 'row'
            }}
        >
            {tabs.map((title, index) => renderTabButton(title, index))}
        </View>
    );
}

const styles = StyleSheet.create({
    titleBold: {
        fontFamily: MONTSERRAT_BOLD,
        fontSize: SIZES.FONT_H4,
        textAlign: 'center'
    },
});
