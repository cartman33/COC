// app/(tabs)/index.tsx

import React, { useState, useEffect } from 'react'; // (수정) useEffect 훅 추가
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert, // (수정) Alert 훅 추가
} from 'react-native';

// 컴포넌트 3개 import
import { TimePickerInput } from '../../components/TimePickerInput'; 
import { PotionPickerInput } from '../../components/PotionPickerInput';
import { DurationPickerInput } from '../../components/DurationPickerInput';

// 이미지 (기존과 동일)
const cocLogo = require('../../assets/images/coc.png');
const footerImage = require('../../assets/images/footer.png');

// Duration 타입 (기존과 동일)
type Duration = {
  days: number;
  hours: number;
  minutes: number;
};

// (새로 추가) 카운트다운 타이머를 관리할 변수
let countdownInterval: ReturnType<typeof setInterval> | null = null;

// 메인 화면 컴포넌트
export default function HomeScreen() {

  // --- State 관리 ---
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  
  // (수정) 0을 "선택 안 됨" (placeholder) 상태로 사용합니다.
  const [potionCount, setPotionCount] = useState<number>(0);         
  
  const [duration, setDuration] = useState<Duration | null>(null);
  const [remaining, setRemaining] = useState(''); // (수정) "잔여 시간" (결과 표시줄)
  
  // (새로 추가) 계산이 완료될 목표 시간을 저장할 State
  const [endTime, setEndTime] = useState<Date | null>(null);

  // --- (새로 추가) 실시간 카운트다운 로직 ---
  // 'useEffect' 훅은 'endTime' State가 변경될 때마다 실행됩니다.
  useEffect(() => {
    // 1. 이전에 실행 중이던 타이머가 있다면(countdownInterval), 일단 정지시킵니다.
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    // 2. 'endTime'(목표 시간)이 설정되었다면, 새 타이머를 시작합니다.
    if (endTime) {
      // 3. 1초(1000ms)마다 updateRemainingTime 함수를 실행하는 타이머를 설정합니다.
      countdownInterval = setInterval(() => {
        
        // 4. (내부 함수) 남은 시간을 계산하는 함수
        const now = new Date();
        const diffMs = endTime.getTime() - now.getTime(); // 목표 시간 - 현재 시간 (밀리초)

        // 5. 남은 시간이 0초 미만이면 타이머를 종료합니다.
        if (diffMs < 0) {
          if (countdownInterval) clearInterval(countdownInterval);
          setRemaining('완료되었습니다!');
          setEndTime(null); // 타이머 종료
          return;
        }

        // 6. 남은 시간(밀리초)을 "일, 시, 분"으로 변환합니다.
        //    (3.2333 대신 정수(Math.floor)로 변환)
        let totalMinutes = Math.floor(diffMs / 60000); // 총 남은 분
        const days = Math.floor(totalMinutes / (24 * 60)); // 남은 일
        totalMinutes %= (24 * 60); // 일을 제외한 남은 분
        const hours = Math.floor(totalMinutes / 60); // 남은 시
        const minutes = totalMinutes % 60; // 남은 분
        
        // 7. "잔여 시간" state를 업데이트합니다.
        setRemaining(`${days}일 ${hours}시간 ${minutes}분 남음`);
        
      }, 1000); // 1초마다 실행
    }

    // 8. (정리) 이 컴포넌트가 사라질 때 타이머를 꼭 정리합니다. (메모리 누수 방지)
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [endTime]); // 'endTime' state가 바뀔 때마다 이 훅을 다시 실행합니다.

// app/(tabs)/index.tsx 파일

  // --- (수정) 계산 버튼 함수 ---
  const onCalculatePress = () => {
    
    // [입력값 검증]
    if (!currentTime || !duration || potionCount === 0) {
      Alert.alert('입력 오류', '모든 값을 정확히 입력해주세요. (포션 0개 제외)');
      setRemaining('');
      setEndTime(null); // 타이머 중지
      return;
    }

    // --- [C 코드 로직 번역 시작] ---

    // 1. '현재 시간'의 총 밀리초(ms)
    const current_total_ms = currentTime.getTime();

    // 2. '총 소요 시간(ms)'
    const original_duration_minutes = (duration.days * 24 * 60) + (duration.hours * 60) + duration.minutes;
    const original_duration_ms = original_duration_minutes * 60 * 1000;

    // 3. [C 로직] 포션 1개당 10시간 단축
    const saved_minutes = potionCount * 10 * 60; // (p * 600분)
    const saved_ms = saved_minutes * 60 * 1000;

    // 4. [C 로직] 실제 소요 시간(ms) 계산
    let actual_duration_ms = original_duration_ms - saved_ms;
    if (actual_duration_ms < 0) {
      actual_duration_ms = 0;
    }

    // 5. [C 로직] 최종 종료 시간(ms) 계산
    const end_total_ms = current_total_ms + actual_duration_ms;

    // 6. 'endTime' State에 "목표 시간(Date 객체)"으로 저장
    //    -> 이 State가 변경되면, 위의 'useEffect' 훅이 타이머를 *시작*합니다.
    setEndTime(new Date(end_total_ms));

    // --- [핵심 수정] ---
    // 7. "1초 지연" 버그를 막기 위해, 버튼을 누른 *즉시*
    //    첫 번째 '남은 시간'을 계산해서 'remaining' state에 설정합니다.
    //    (useEffect의 로직을 그대로 한번 더 실행)
    
    // (실제 남은 시간(ms) = actual_duration_ms)
    if (actual_duration_ms < 0) { // 혹시 모르니 한번 더 체크
        setRemaining('완료되었습니다!');
        return;
    }

    // 남은 시간(밀리초)을 "일, 시, 분"으로 변환 (정수)
    let totalMinutes = Math.floor(actual_duration_ms / 60000); // 총 남은 분
    const days = Math.floor(totalMinutes / (24 * 60)); // 남은 일
    totalMinutes %= (24 * 60); // 일을 제외한 남은 분
    const hours = Math.floor(totalMinutes / 60); // 남은 시
    const minutes = totalMinutes % 60; // 남은 분
    
    // "잔여 시간" state를 *즉시* 업데이트합니다.
    setRemaining(`${days}일 ${hours}시간 ${minutes}분 남음`);
    // --- [수정 완료] ---
    
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
            {/* (수정) 부모의 'currentTime' state를 'value' prop으로 전달 */}
            <TimePickerInput 
              value={currentTime} 
              onTimeChange={setCurrentTime} 
            />

            {/* 2. 장인 포션
                (수정) 부모의 'potionCount' state를 'value' prop으로 전달
            */}
            <PotionPickerInput 
              value={potionCount} 
              onCountChange={setPotionCount} 
            />
            
            {/* 3. 소요 시간 */}
            <DurationPickerInput onDurationChange={setDuration} />
            
            {/* 4. 잔여 시간 (결과 표시창) */}
            <TextInput
              style={[styles.input, styles.resultInput]} // (수정) 결과창 스타일
              placeholder="완료 예정 시각 (자동 계산)"
              placeholderTextColor="#AAAAAA"
              value={remaining} // 카운트다운 텍스트가 여기에 표시됨
              editable={false} // 수정 불가
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
// (수정) 'resultInput' 스타일 추가
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
    gap: 20,
  },
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
  // (새로 추가) 계산 결과가 표시되는 입력창 스타일
  resultInput: {
    backgroundColor: '#f0f0f0',
    color: '#333333',
    fontWeight: 'bold',
  },
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