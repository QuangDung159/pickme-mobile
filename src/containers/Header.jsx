import { withNavigation } from '@react-navigation/compat';
import {
    Block, Button, NavBar, Text, theme
} from 'galio-framework';
import React, { PureComponent } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import {
    IconFamily, NowTheme, ScreenName, ScreenTitle
} from '../constants';
import { IconCustom, Input, Tabs } from '../components/uiComponents';

const iPhoneX = Platform.OS === 'ios';

const BellButton = ({ isWhite, style, navigation }) => (
    <TouchableOpacity
        style={[styles.button, style]}
        onPress={() => navigation.navigate(ScreenName.HOME)}
    >
        <IconCustom
            family={IconFamily.IONICONS}
            size={24}
            name="ios-notifications-outline"
            color={NowTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
        />
        <Block middle style={[styles.notify, { backgroundColor: NowTheme.COLORS[isWhite ? 'WHITE' : 'PRIMARY'] }]} />
    </TouchableOpacity>
);

class Header extends PureComponent {
    handleLeftPress = () => {
        const { back, navigation } = this.props;
        return back ? navigation.goBack() : navigation.openDrawer();
    };

    renderRight = () => {
        const { white, title, navigation } = this.props;

        if (title === 'Title') {
            return [
                <BellButton key="chat-title" navigation={navigation} isWhite={white} />,
            ];
        }

        switch (title) {
            case ScreenTitle.HOME:
                return [
                    <BellButton key="chat-home" navigation={navigation} isWhite={white} />,
                ];
            default:
                return null;
        }
    };

    renderSearch = () => (
        <Input
            right
            color="black"
            style={styles.search}
            placeholder="Bạn muốn tìm gì?"
            placeholderTextColor="#8898AA"
            iconContent={(
                <IconCustom
                    size={16}
                    name="zoom-bold2x"
                    family={IconFamily.NOW_EXTRA}
                    color={theme.COLORS.MUTED}
                />
            )}
        />
    );

    renderOptions = () => {
        const { navigation, optionLeft, optionRight } = this.props;

        return (
            <Block row style={styles.options}>
                <Button
                    shadowless
                    style={[styles.tab, styles.divider]}
                >
                    <Block row middle>
                        <IconCustom
                            name="bulb"
                            family={IconFamily.NOW_EXTRA}
                            size={NowTheme.SIZES.FONT_H2}
                            style={{ paddingRight: 8 }}
                            color={NowTheme.COLORS.HEADER}
                        />
                        <Text size={16} style={styles.tabTitle}>
                            {optionLeft || 'Beauty'}
                        </Text>
                    </Block>
                </Button>
                <Button shadowless style={styles.tab} onPress={() => navigation.navigate(ScreenName.HOME)}>
                    <Block row middle>
                        <Block
                            style={{
                                paddingRight: 8
                            }}
                        >
                            <IconCustom
                                size={NowTheme.SIZES.FONT_H2}
                                name="bag-162x"
                                family={IconFamily.NOW_EXTRA}
                                color={NowTheme.COLORS.HEADER}
                            />
                        </Block>

                        <Text size={16} style={styles.tabTitle}>
                            {optionRight || 'Fashion'}
                        </Text>
                    </Block>
                </Button>
            </Block>
        );
    };

    renderTabs = () => {
        const { tabs, tabIndex, navigation } = this.props;
        const defaultTab = tabs && tabs[0] && tabs[0].id;

        if (!tabs) return null;

        return (
            <Tabs
                data={tabs || []}
                initialIndex={tabIndex || defaultTab}
                onChange={(id) => navigation.setParams({ tabId: id })}
            />
        );
    };

    renderHeader = () => {
        const { search, options, tabs } = this.props;
        if (search || tabs || options) {
            return (
                <Block center>
                    {search ? this.renderSearch() : null}
                    {tabs ? this.renderTabs() : null}
                </Block>
            );
        }

        return null;
    };

    render() {
        const {
            back,
            title,
            white,
            transparent,
            bgColor,
            iconColor,
            titleColor,
            navigation,
            screenNameProp,
            ...props
        } = this.props;

        const noShadow = ['Search', 'Categories', 'Deals', 'Pro', 'Profile'].includes(title);
        const headerStyles = [
            !noShadow ? styles.shadow : null,
            transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null
        ];

        const navbarStyles = [
            styles.navbar, bgColor && {
                backgroundColor: bgColor, zIndex: 1
            },
            iPhoneX ? styles.navbarHeight : {}];

        return (
            <Block style={headerStyles}>
                <NavBar
                    back={false}
                    title={title}
                    style={navbarStyles}
                    transparent={transparent}
                    rightStyle={{ alignItems: 'center' }}
                    leftStyle={{ paddingVertical: 12, flex: 0.2 }}
                    titleStyle={[
                        styles.title,
                        { color: NowTheme.COLORS[white ? 'WHITE' : 'HEADER'] },
                        titleColor && { color: titleColor }
                    ]}
                    {...props}
                />
                {screenNameProp && screenNameProp === ScreenName.MESSAGE && (
                    <Block
                        style={{
                            marginLeft: 7,
                            marginTop: 0,
                            zIndex: 99
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                marginTop: iPhoneX ? -10 : -20,
                            }}
                            size={10}
                            color={NowTheme.COLORS.ACTIVE}
                        >
                            Vừa mới truy cập
                        </Text>
                    </Block>
                )}

                {this.renderHeader()}
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        padding: 12,
        position: 'relative'
    },
    title: {
        width: '100%',
        fontSize: 16,
        fontFamily: NowTheme.FONT.MONTSERRAT_BOLD,
        marginLeft: -70
    },
    navbar: {
        paddingTop: iPhoneX ? NowTheme.SIZES.HEIGHT_BASE * 0.05 : null,
        zIndex: 5
    },
    navbarHeight: {
        height: NowTheme.SIZES.HEIGHT_BASE * 0.1,
    },
    shadow: {
        backgroundColor: NowTheme.COLORS.BASE,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.2,
        elevation: 3
    },
    notify: {
        backgroundColor: NowTheme.COLORS.SUCCESS,
        borderRadius: 4,
        height: NowTheme.SIZES.HEIGHT_BASE / 2,
        width: NowTheme.SIZES.WIDTH_BASE / 2,
        position: 'absolute',
        top: 9,
        right: 12
    },
    header: {
        backgroundColor: NowTheme.COLORS.BASE
    },
    divider: {
        borderRightWidth: 0.3,
        borderRightColor: NowTheme.COLORS.BLOCK
    },
    search: {
        height: 48,
        width: NowTheme.SIZES.WIDTH_BASE - 32,
        marginHorizontal: 16,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: NowTheme.COLORS.BORDER
    },
    options: {
        marginBottom: 24,
        marginTop: 10,
        elevation: 4
    },
    tab: {
        backgroundColor: NowTheme.COLORS.TRANSPARENT,
        width: NowTheme.SIZES.WIDTH_BASE * 0.35,
        borderRadius: 0,
        borderWidth: 0,
        height: 24,
        elevation: 0
    },
    tabTitle: {
        lineHeight: 19,
        fontWeight: '400',
        color: NowTheme.COLORS.HEADER,
        fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR
    },
});

export default withNavigation(Header);
