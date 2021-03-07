import React, { PureComponent } from 'react';
import { IconCustom } from '../components/uiComponents';
import { IconFamily, ScreenName } from '../constants';

export default class TabIcon extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            name: 'home',
            family: IconFamily.FONT_AWESOME
        };
    }

    componentDidMount() {
        this.configIcon();
    }

    configIcon = () => {
        const { route } = this.props;

        let name = 'home';
        let family = IconFamily.FONT_AWESOME;

        switch (route.name) {
            case ScreenName.HOME: {
                name = 'home';
                family = IconFamily.FONT_AWESOME_5;
                break;
            }
            case ScreenName.PERSONAL: {
                name = 'user-circle-o';
                family = IconFamily.FONT_AWESOME;
                break;
            }
            case ScreenName.NOTIFICATION: {
                name = 'notifications-active';
                family = IconFamily.MATERIAL_ICONS;
                break;
            }
            case ScreenName.CONVERSATION_LIST: {
                name = 'comment';
                family = IconFamily.FONT_AWESOME;
                break;
            }
            case ScreenName.LEADER_BOARD: {
                name = 'award';
                family = IconFamily.FONT_AWESOME_5;
                break;
            }
            default: {
                name = 'home';
                family = IconFamily.FONT_AWESOME;
                break;
            }
        }

        this.setState({
            name,
            family
        });
    }

    render() {
        const {
            name, family
        } = this.state;

        const { color, size } = this.props;
        return (
            <IconCustom name={name} size={size} color={color} family={family} />
        );
    }
}
