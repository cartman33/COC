// app/(tabs)/index.tsx

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput, // "잔여 시간"을 위해 TextInput은 남겨둡니다.
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';

// --- (중요) ---
// 우리가 만든 '직원' 컴포넌트 3개를 모두 import 합니다.
import { TimePickerInput } from '../../components/TimePickerInput'; 
import { PotionPickerInput } from '../../components/PotionPickerInput';
import { DurationPickerInput } from '../../components/DurationPickerInput';

// 이미지 (기존과 동일)
const cocLogo = require('../../assets/images/coc.png');
const footerImage = require('../../assets/images/footer.png');

// Duration 타입 (DurationPickerInput과 형식을 맞춥니다)
type Duration = {
  days: number;
  hours: number;
  minutes: number;
};

// 메인 화면 컴포넌트
export default function HomeScreen() {

  // --- (수정) State 관리 ---
  // Main(사장님)은 이제 "최종 결과 값"만 State로 관리합니다.
  // Picker가 보이는지 여부(isModalVisible) 등은 각 컴포넌트가 알아서 관리합니다.
  
  const [currentTime, setCurrentTime] = useState<Date | null>(null); // 1. 시간
  const [potionCount, setPotionCount] = useState<number>(0);         // 2. 포션 개수
  const [duration, setDuration] = useState<Duration | null>(null);  // 3. 소요 시간
  const [remaining, setRemaining] = useState('');                 // 4. 잔여 시간 (TextInput)

  // 계산 버튼 함수
  const onCalculatePress = () => {
    // 콘솔에 현재 값들을 출력합니다.
    console.log('선택된 시간:', currentTime?.toLocaleString() || '설정 안됨');
    console.log('포션 개수:', potionCount || '설정 안됨');
    console.log('소요 시간:', duration ? `${duration.days}일 ${duration.hours}시 ${duration.minutes}분` : '설정 안됨');
    console.log('잔여 시간:', remaining || '입력 안됨');
  };

  // 렌더링
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.main}>
        
        {/* --- 1. Header (기존과 동일) --- */}
        <View style={styles.header}>
          <Image source={cocLogo} style={styles.cocLogo} resizeMode="contain" />
          <Text style={styles.subtitle}>Master Calculator</Text>
        </View>

        {/* --- 2. Body (수정됨) --- */}
        <View style={styles.frame}>
          <View style={styles.body}>

            {/* 1. 현재 시간 */}
            {/* TimePickerInput 컴포넌트를 호출합니다.
                onTimeChange 속성으로 "시간이 바뀌면 setCurrentTime을 실행해!" 라고 알려줍니다. */}
            <TimePickerInput onTimeChange={setCurrentTime} />

            {/* 2. 사용할 장인 포션 개수 */}
            {/* PotionPickerInput 컴포넌트를 호출합니다. */}
            <PotionPickerInput onCountChange={setPotionCount} />
            
            {/* 3. 소요 시간 */}
            {/* DurationPickerInput 컴포넌트를 호출합니다. */}
            <DurationPickerInput onDurationChange={setDuration} />
            
            {/* 4. 잔여 시간 (이것만 TextInput으로 유지) */}
            <TextInput
              style={styles.input}
              placeholder="잔여 시간"
              placeholderTextColor="#AAAAAA"
              value={remaining}
              onChangeText={setRemaining}
            />

            {/* 계산 버튼 */}
            <TouchableOpacity style={styles.submitButton} onPress={onCalculatePress}>
              <Text style={styles.submitButtonText}>Calculate</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- 3. Footer (기존과 동일) --- */}
        <View style={styles.footer}>
          <Image source={footerImage} style={styles.footerImage} resizeMode="cover" />
          <Text style={styles.footerText}>Coding by CartMan33</Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

// --- StyleSheet (스타일 정의) ---
// 폰트가 적용된 최종 스타일시트
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  main: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 20 : 0,
    paddingVertical: 20,
  },
  cocLogo: {
    width: 220,
    height: 101,
  },
  subtitle: {
    fontSize: 14,
    color: '#000000',
    marginTop: 10,
    fontFamily: 'Mulish-Regular',
  },
  frame: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  body: {
    width: '100%',
    gap: 20, // 각 컴포넌트 사이의 간격
  },
  // '잔여 시간' TextInput에 적용될 스타일
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Mulish-Regular',
    justifyContent: 'center',
  },
  // 계산 버튼
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Mulish-Regular',
  },
  // 푸터
  footer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 20,
  },
  footerImage: {
    width: 100,
    height: 100,
  },
  footerText: {
    fontSize: 14,
    color: '#000000',
    marginTop: 10,
    fontFamily: 'Mulish-Regular',
  },
});