import React from 'react';
import { Text } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { NowTheme } from '../../../constants';

const {
    FONT: {
        MONTSERRAT_BOLD
    },
    SIZES,
    COLORS
} = NowTheme;

export default function TopTabBar({
    tabActiveIndex, setTabActiveIndex, routes, renderScene,
    tabButtonStyle, labelStyle, indicatorStyle
}) {
    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={
                [
                    {
                        backgroundColor: COLORS.ACTIVE
                    },
                    indicatorStyle
                ]
            }
            style={
                [
                    {
                        backgroundColor: COLORS.LIST_ITEM_BACKGROUND_1
                    },
                    tabButtonStyle
                ]
            }
            renderLabel={({ route }) => (
                <Text style={
                    [
                        {
                            color: COLORS.ACTIVE,
                            fontFamily: MONTSERRAT_BOLD,
                            fontSize: SIZES.FONT_H4
                        },
                        labelStyle
                    ]
                }
                >
                    {route.title}
                </Text>
            )}
        />
    );

    const renderTabView = () => (
        <TabView
            navigationState={{
                index: tabActiveIndex || 0,
                routes
            }}
            renderScene={renderScene}
            onIndexChange={(index) => {
                if (setTabActiveIndex) setTabActiveIndex(index);
            }}
            initialLayout={{ width: SIZES.WIDTH_BASE }}
            indicatorStyle={{ backgroundColor: 'white' }}
            tabStyle={{
                backgroundColor: COLORS.ACTIVE
            }}
            renderTabBar={renderTabBar}
        />
    );

    return (
        <>
            {renderTabView()}
        </>
    );
}
