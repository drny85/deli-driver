import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container } from '@/components/Container';
import { SIZES } from '@/constants/Colors';
import { connectedStore } from '@/firebase';
import { useAuth } from '@/providers/authProvider';
import { useUser } from '@/hooks/useUser';
import { onlyNumbers } from '@/utils/onlyNumbers';
import WebView, { WebViewNavigation } from 'react-native-webview';
import { Button } from '@/components/Button';
import Loading from '@/components/Loading';
import { router } from 'expo-router';

const StripeOnboarding = () => {
  const { user } = useUser();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(false);
  const [stripeLinkUrl, setStripeLinkUrl] = useState<string | null>(null);
  const getParams = (url: string) => {
    let regexp = /[?&]([^=#]+)=([^&#]*)/g;
    let params: any = {};
    let check;
    while ((check = regexp.exec(url))) {
      params[check[1]] = check[2];
    }
    return params;
  };

  const getLink = async () => {
    try {
      setLoading(true);
      const func = connectedStore();
      const { data } = await func({
        businessName: `${user?.name} Delivery`,
        phone: onlyNumbers(user?.phone!),
        // address: business.address!,
        lastName: user?.lastName!,
        name: user?.name!,
        type: 'courier',
        mode: process.env.NODE_ENV !== 'production' ? 'test' : undefined,
      });

      if (data.success) {
        setStripeLinkUrl(data.result);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const checkForAccountSuccefull = async (
    url: string
  ): Promise<{ success: boolean; accountId: string | null }> => {
    try {
      if (url.includes('/return_url')) {
        const { accountId } = getParams(url);
        console.log(accountId);
        return { success: true, accountId: accountId };
      } else {
        return { success: false, accountId: null };
      }
    } catch (error) {
      console.log(error);
      return { success: false, accountId: null };
    }
  };

  const handleNavigationChanges = useCallback(
    async (newNavState: WebViewNavigation) => {
      const { url, loading } = newNavState;

      try {
        console.log('URL =>', url, loading);
        const { success, accountId } = await checkForAccountSuccefull(url);
        if (success && accountId) {
          router.replace('/welcome');
        }
      } catch (error) {
        console.log('ERROR =>', error);
      }
    },
    [loading]
  );

  if (loading) return <Loading />;

  if (stripeLinkUrl) {
    return (
      <WebView
        style={{ flex: 1, paddingTop: SIZES.md }}
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ uri: stripeLinkUrl }}
        onNavigationStateChange={handleNavigationChanges}
        sharedCookiesEnabled={true}></WebView>
    );
  }
  return (
    <Container>
      <View style={{ flex: 1, padding: SIZES.md }}>
        <Button title="Go" onPress={getLink} />
      </View>
    </Container>
  );
};

export default StripeOnboarding;

const styles = StyleSheet.create({});
