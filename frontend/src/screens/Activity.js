import { View, Image, Text, SafeAreaView, StatusBar, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'

const Activity = () => {
  return (
    <View>
          <Image
            source={require('../../assets/image.png')} // 동일한 이미지를 다른 버튼에서도 사용
          />
    </View>
  )
}

export default Activity
