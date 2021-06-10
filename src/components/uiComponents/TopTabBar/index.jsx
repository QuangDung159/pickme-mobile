import { Block, Text } from 'galio-framework';
import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { NowTheme } from '../../../constants';

export default function TopTabBar({ tabs, tabActiveIndex, setTabActiveIndex }) {
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
                    flex: 1,
                    height: 45
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

    return (
        <Block
            row
            style={[{
                height: 45
            }]}
        >
            {tabs.map((title, index) => renderTabButton(title, index))}
        </Block>
    );
}

const styles = StyleSheet.create({
    titleBold: {
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
        fontSize: NowTheme.SIZES.FONT_H4,
        textAlign: 'center'
    },
});
