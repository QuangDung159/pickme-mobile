import { theme } from 'galio-framework';
import React, { PureComponent } from 'react';
import {
    Animated, FlatList, StyleSheet, View
} from 'react-native';
import { NowTheme } from '../../constants';

export default class Tabs extends PureComponent {
  animatedValue = new Animated.Value(1);

  menuRef = React.createRef();

  constructor(props) {
      super(props);
      this.state = {
          active: null,
      };
  }

  componentDidMount() {
      const { initialIndex } = this.props;
      initialIndex && this.selectMenu(initialIndex);
  }

  onScrollToIndexFailed = () => {
      this.menuRef.current.scrollToIndex({
          index: 0,
          viewPosition: 0.5
      });
  }

  selectMenu = (id) => {
      this.setState({ active: id });
      const {
          data,
          onChange
      } = this.props;

      this.menuRef.current.scrollToIndex({
          index: data.findIndex((item) => item.id === id),
          viewPosition: 0.5
      });

      this.animate();
      onChange && onChange(id);
  }

  animate() {
      this.animatedValue.setValue(0);

      Animated.timing(this.animatedValue, {
          toValue: 1,
          duration: 300,
          // useNativeDriver: true, // color not supported
      }).start();
  }

  renderItem = (item) => {
      const {
          active
      } = this.state;
      const isActive = active === item.id;

      const textColor = this.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [NowTheme.COLORS.TEXT, isActive ? NowTheme.COLORS.BASE : NowTheme.COLORS.SECONDARY],
          extrapolate: 'clamp',
      });

      const containerStyles = [
          styles.titleContainer,
          !isActive && { backgroundColor: NowTheme.COLORS.TABS },
          isActive && styles.containerShadow
      ];

      return (
          <View style={containerStyles}>
              <Animated.Text
                  style={[
                      styles.menuTitle,
                      { color: textColor },
                      { fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR },
                  ]}
                  onPress={() => this.selectMenu(item.id)}
              >
                  {item.title}
              </Animated.Text>
          </View>
      );
  }

  renderMenu = () => {
      const { data, ...props } = this.props;

      return (
          <FlatList
              {...props}
              data={data}
              horizontal
              ref={this.menuRef}
              extraData={this.state}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              onScrollToIndexFailed={this.onScrollToIndexFailed}
              renderItem={({ item }) => this.renderItem(item)}
              contentContainerStyle={styles.menu}
          />
      );
  }

  render() {
      return (
          <View style={styles.container}>
              {this.renderMenu()}
          </View>
      );
  }
}

const styles = StyleSheet.create({
    container: {
        width: NowTheme.SIZES.WIDTH_BASE,
        backgroundColor: theme.COLORS.WHITE,
        zIndex: 2,
    },
    shadow: {
        shadowColor: theme.COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        shadowOpacity: 0.2,
        elevation: 4,
    },
    menu: {
        paddingHorizontal: theme.SIZES.BASE * 2.5,
        paddingTop: 8,
        paddingBottom: 16,
    },
    titleContainer: {
        alignItems: 'center',
        backgroundColor: NowTheme.COLORS.ACTIVE,
        borderRadius: 21,
        marginRight: 9,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    containerShadow: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.1,
        elevation: 1,
    },
    menuTitle: {
        fontWeight: '600',
        fontSize: 14,
        paddingVertical: 8,
        paddingHorizontal: 12,
        color: NowTheme.COLORS.MUTED
    },
});
