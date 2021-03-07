import {
    createIconSetFromIcoMoon,
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    FontAwesome,
    FontAwesome5,
    Fontisto,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    SimpleLineIcons
} from '@expo/vector-icons';
import React from 'react';

import nowConfig from '../../../assets/configs/now.json';
import { IconFamily } from '../../constants';

const IconNowExtra = createIconSetFromIcoMoon(nowConfig, 'NowExtra');

export default function IconCustom(props) {
    const {
        name,
        family,
        color,
        size
    } = props;

    const renderIcon = () => {
        switch (family) {
            case IconFamily.FONT_AWESOME: {
                return (<FontAwesome name={name} size={size} color={color} />);
            }
            case IconFamily.FONT_AWESOME_5: {
                return (<FontAwesome5 name={name} size={size} color={color} />);
            }
            case IconFamily.ANT_DESIGN: {
                return (<AntDesign name={name} size={size} color={color} />);
            }
            case IconFamily.ENTYPO: {
                return (<Entypo name={name} size={size} color={color} />);
            }
            case IconFamily.EVIL_ICONS: {
                return (<EvilIcons name={name} size={size} color={color} />);
            }
            case IconFamily.FEATHER: {
                return (<Feather name={name} size={size} color={color} />);
            }
            case IconFamily.MATERIAL_COMMUNITY_ICONS: {
                return (<MaterialCommunityIcons name={name} size={size} color={color} />);
            }
            case IconFamily.MATERIAL_ICONS: {
                return (<MaterialIcons name={name} size={size} color={color} />);
            }
            case IconFamily.IONICONS: {
                return (<Ionicons name={name} size={size} color={color} />);
            }
            case IconFamily.FONTISTO: {
                return (<Fontisto name={name} size={size} color={color} />);
            }
            case IconFamily.SIMPLE_LINE_ICONS: {
                return (<SimpleLineIcons name={name} size={size} color={color} />);
            }
            default: {
                return (<IconNowExtra name={name} family={IconFamily.NOW_EXTRA} />);
            }
        }
    };

    return (
        <>
            {renderIcon()}
        </>
    );
}
