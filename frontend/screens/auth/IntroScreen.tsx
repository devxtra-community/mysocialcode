import { Image } from 'react-native';
import { Onboarding } from '@/components/ui/onboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
export default function IntroScreen() {
  const steps = [
    {
      id: 'events',
      title: 'Discover Events',
      description: 'Find tech events happening around you.',
      image: (
        <Image
          source={require('@/assets/onBoarding/onboard1.jpg')}
          style={{ width: 280, height: 280 }}
          resizeMode="contain"
        />
      ),
    },
    {
      id: 'connect',
      title: 'Connect with Developers',
      description: 'Meet people who share your passion for coding.',
      image: (
        <Image
          source={require('@/assets/onBoarding/onboard2.jpg')}
          style={{ width: 280, height: 280 }}
          resizeMode="contain"
        />
      ),
    },
    {
      id: 'community',
      title: 'Build Together',
      description: 'Join a growing community and build amazing things.',
      image: (
        <Image
          source={require('@/assets/onBoarding/onboard3.jpg')}
          style={{ width: 280, height: 280 }}
          resizeMode="contain"
        />
      ),
    },
  ];
  function finishIntro() {
    AsyncStorage.setItem('hasSeenIntro', 'false');
    router.push('/(auth)/phone');
  }

  return <Onboarding steps={steps} showSkip={false} onComplete={finishIntro} />;
}
