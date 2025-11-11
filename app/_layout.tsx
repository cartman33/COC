// app/(tabs)/_layout.tsx

import React from 'react';
import { Tabs } from 'expo-router';
// (새로 추가) 폰트 로드를 위해 useFonts 훅을 가져옵니다.
import { useFonts } from 'expo-font';

export default function TabLayout() {
  
  // --- (중요) 폰트 로딩 로직을 index.tsx에서 이 파일로 이동 ---
  const [fontsLoaded] = useFonts({
    'Mulish-Regular': require('../assets/fonts/Mulish-Regular.ttf'),
  });

  // 폰트가 로드되지 않았으면, 앱 껍데기(Tabs) 자체를 렌더링하지 않습니다.
  // 폰트 로드가 완료되면 (true) 이 코드를 통과하고 <Tabs>가 렌더링됩니다.
  if (!fontsLoaded) {
    return null; // 로딩 중... (아무것도 그리지 않음)
  }
  // --- 여기까지 추가 ---

  // 폰트 로드가 완료되면 탭 레이아웃을 렌더링합니다.
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          // (참고) 탭 바의 'Home' 글씨에도 Mulish 폰트를 적용하고 싶다면
          // 여기에 'tabBarLabelStyle: { fontFamily: 'Mulish-Regular' }'을 추가하면 됩니다.
        }}
      />
      {/* explore 탭은 삭제된 상태 (정상) */}
    </Tabs>
  );
}