import React from 'react';
import {View} from 'react-native';
import {ApplePayButton} from 'react-native-rn-apple-pay-button';

const ApplePay = () => {
  return (
    <View>
      <ApplePayButton
        buttonStyle="black"
        type="donate"
        cornerRadius={8} // Default value is 4.0
        width={200}
        height={45}
        onPress={() => console.log('Press')}
      />
    </View>
  );
};

export default ApplePay;
