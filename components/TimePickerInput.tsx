// components/TimePickerInput.tsx

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// 'react-native-modal-datetime-picker' 라이브러리를 사용합니다.
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// 이 컴포넌트가 부모(index.tsx)로부터 받을 Props 타입 정의
type TimePickerInputProps = {
  // onTimeChange는 Date 객체를 받아 부모에게 전달하는 함수입니다.
  onTimeChange: (date: Date) => void;
};

export const TimePickerInput: React.FC<TimePickerInputProps> = ({ onTimeChange }) => {
  
  // 이 컴포넌트가 내부적으로 사용할 State (부모는 이 State를 모릅니다)
  const [selectedTime, setSelectedTime] = useState(new Date()); // 선택된 시간
  const [timeIsSet, setTimeIsSet] = useState(false);            // 사용자가 선택했는지 여부
  const [isPickerVisible, setPickerVisible] = useState(false);  // Picker 팝업이 보이는지 여부

  // Picker 헬퍼 함수
  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);

  // 사용자가 "확인"을 눌렀을 때
  const handleTimeConfirm = (date: Date) => {
    setSelectedTime(date); // 1. 내부 State 업데이트
    setTimeIsSet(true);
    onTimeChange(date);    // 2. Props로 받은 함수를 실행해 부모(index.tsx)에게 보고
    hidePicker();          // 3. 팝업 닫기
  };

  return (
    <View style={{ width: '100%' }}>
      {/* 입력창처럼 보이는 버튼 */}
      <TouchableOpacity style={styles.input} onPress={showPicker}>
        <Text
          style={[
            styles.inputText,
            !timeIsSet && styles.placeholderText // 시간이 설정 안됐으면 회색
          ]}
        >
          {timeIsSet ? selectedTime.toLocaleString('ko-KR') : '현재 시간'}
        </Text>
      </TouchableOpacity>

      {/* 시간 선택기 모달(팝업) */}
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="datetime" // 날짜와 시간을 모두 선택
        onConfirm={handleTimeConfirm}
        onCancel={hidePicker}
        date={selectedTime}
      />
    </View>
  );
};

// --- 스타일 ---
const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
    fontFamily: 'Mulish-Regular', // 폰트 적용
  },
  inputText: {
    fontSize: 16,
    fontFamily: 'Mulish-Regular',
    color: '#000000',
  },
  placeholderText: {
    color: '#AAAAAA',
  },
});