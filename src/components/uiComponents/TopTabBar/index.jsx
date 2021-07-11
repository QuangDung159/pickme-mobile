import { Theme } from '@constants/index';
import React from 'react';
import { Text } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';

const {
    FONT: {
        MONTSERRAT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

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
                        backgroundColor: COLORS.DEFAULT,
                    },
                    indicatorStyle
                ]
            }
            style={
                [
                    {
                        backgroundColor: COLORS.BLOCK,
                        height: 50,
                        padding: 0,
                        justifyContent: 'center'
                    },
                    tabButtonStyle
                ]
            }
            tabStyle={{
                alignSelf: 'center',
                justifyContent: 'center',
                padding: 0,
            }}
            renderLabel={({ route }) => (
                <Text style={
                    [
                        {
                            color: COLORS.ACTIVE,
                            fontFamily: MONTSERRAT_BOLD,
                            fontSize: SIZES.FONT_H4,
                            textAlign: 'center',
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
            renderTabBar={renderTabBar}
        />
    );

    return (
        <>
            {renderTabView()}
        </>
    );
}
