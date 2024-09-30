import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {}

const CustomText: React.FC<CustomTextProps> = ({ style, ...rest}) => {
    const customStyle = {
        fontFamily: 'Pretendard-Bold',
        color: '#616161'
    };

    return <RNText style={[customStyle, style]} {...rest} />;
};

export default CustomText;