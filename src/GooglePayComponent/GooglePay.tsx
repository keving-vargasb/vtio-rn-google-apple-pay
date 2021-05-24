import React, {FunctionComponent, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Image} from 'react-native';
import {GooglePay} from 'react-native-google-pay';

export type CardNetworkTypes =
  | 'AMEX'
  | 'DISCOVER'
  | 'JCB'
  | 'MASTERCARD'
  | 'VISA';

export type Environment = 'TEST' | 'PRODUCTION';

export type CardAuthMethodsTypes = 'PAN_ONLY' | 'CRYPTOGRAM_3DS';

export type tokenizationSpecificationType = 'PAYMENT_GATEWAY' | 'DIRECT';

export interface RequestDataType {
  cardPaymentMethod: {
    tokenizationSpecification: {
      type: tokenizationSpecificationType;
      /** only with type: PAYMENT_GATEWAY */
      gateway?: string;
      /** only with type: PAYMENT_GATEWAY */
      gatewayMerchantId?: string;
      /** only with gateway: stripe */
      stripe?: {
        publishableKey: string;
        version: string;
      };
      /** only with type: DIRECT */
      publicKey?: string;
    };
    allowedCardNetworks: CardNetworkTypes[];
    allowedCardAuthMethods: CardAuthMethodsTypes[];
  };
  transaction: {
    totalPrice: string;
    totalPriceStatus: string;
    currencyCode: string;
  };
  merchantName: string;
}

interface GooglePayButtonProps {
  allowedCardNetworks: CardNetworkTypes[];
  allowedCardAuthMethods: CardAuthMethodsTypes[];
  requestData: RequestDataType;
  environment: Environment;
  processPaymentCallback: (token: string) => any;
  errorCallback: (error: any) => any;
}

const GooglePayButton: FunctionComponent<GooglePayButtonProps> = ({
  allowedCardNetworks,
  allowedCardAuthMethods,
  requestData,
  environment,
  processPaymentCallback,
  errorCallback,
}) => {
  useEffect(() => {
    if(environment == 'TEST'){
      GooglePay.setEnvironment(GooglePay.ENVIRONMENT_TEST);
      return;
    }

    GooglePay.setEnvironment(GooglePay.ENVIRONMENT_PRODUCTION);
  }, []);

  const makePayment = () => {
    GooglePay.isReadyToPay(allowedCardNetworks, allowedCardAuthMethods).then(
      (ready: any) => {
        if (ready) {
          // Request payment token
          GooglePay.requestPayment(requestData)
            .then((token: string) => {
              processPaymentCallback(token);
            })
            .catch((error: any) => {
              errorCallback(error);
              console.log(error.code, error.message)
            });
        }
      },
    );
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => makePayment()}>
        <Text style={styles.buttonText}>Buy with</Text>
        <Image
          style={styles.googleIcon}
          source={require('./google-logo.png')}
        />
        <Text style={styles.buttonText}>Pay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    height: 40,
    borderRadius: 3,
  },
  buttonText: {
    color: 'white',
  },
  googleIcon: {
    height: 20,
    width: 20,
    marginHorizontal: 5,
  },
});

export default GooglePayButton;
