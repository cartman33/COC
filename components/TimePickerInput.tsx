// components/TimePickerInput.tsx

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Button, Platform } from 'react-native';
// (수정) 'modal-datetime-picker' 대신, 'community/datetimepicker'를 직접 import
import DateTimePicker from '@react-native-community/datetimepicker';

/**
 * (수정) Props 타입 정의
 * 부모(index.tsx)로부터 현재 값(value)도 받도록 수정합니다.
 */
type TimePickerInputProps = {
  value: Date | null; // 부모가 관리하는 현재 선택된 날짜
  onTimeChange: (date: Date) => void;
};

/**
 * (수정) TimePickerInput 컴포넌트
 * 부모로부터 'value'를 전달받습니다.
 */
export const TimePickerInput: React.FC<TimePickerInputProps> = ({ value, onTimeChange }) => {
  
  // 내부 State
  const [isModalVisible, setModalVisible] = useState(false);
  // (수정) Picker가 임시로 사용할 시간 (부모의 값이나 현재 시간으로 초기화)
  const [tempTime, setTempTime] = useState(value || new Date());

  // 모달을 열 때, 부모의 현재 값(value)으로 임시 값을 설정
  const openModal = () => {
    setTempTime(value || new Date());
    setModalVisible(true);
  };

  // "확인" 버튼을 눌렀을 때
  const handleConfirm = () => {
    onTimeChange(tempTime); // 1. 부모(index.tsx)에게 임시 시간(tempTime) 보고
    setModalVisible(false); // 2. 모달 닫기
  };

  // "취소" 버튼을 눌렀을 때
  const handleCancel = () => {
    setModalVisible(false);
  };

  /**
   * (수정) @react-native-community/datetimepicker의 onChange 핸들러
   * 휠을 스크롤할 때마다 'tempTime' state를 실시간으로 업데이트합니다.
   */
  const onPickerChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempTime(selectedDate);
    }
  };

  // (수정) 표시될 텍스트 (부모의 'value' 기준)
  const getSelectedText = () => {
    if (!value) {
      return '현재 시간'; // value가 null이면 (선택 안 됨)
    }
    // (수정) C코드 로직과 맞추기 위해 날짜/시간 포맷팅
    return value.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={{ width: '100%' }}>
      {/* 입력창처럼 보이는 버튼 */}
      <TouchableOpacity style={styles.input} onPress={openModal}>
        <Text style={[
            styles.inputText,
            !value && styles.placeholderText // value가 null이면 회색
        ]}>
          {getSelectedText()}
        </Text>
      </TouchableOpacity>

      {/* (수정) 팝업 모달
        PotionPickerInput과 동일한 'Modal' 컴포넌트를 사용합니다.
      */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>현재 시간 선택</Text>
            
            {/*
              (수정) 네이티브 휠(Wheel) 컴포넌트
              이 컴포넌트를 우리가 만든 흰색 뷰 안에 넣습니다.
            */}
            <DateTimePicker
              value={tempTime} // 임시 시간
              mode="datetime"  // 날짜와 시간 모두
              display={Platform.OS === 'ios' ? 'spinner' : 'default'} // (중요) iOS에서 휠 모양
              onChange={onPickerChange} // 휠 돌릴 때마다 tempTime 업데이트
              style={styles.picker} // (수정) 휠 스타일에 높이와 너비 지정
              textColor={Platform.OS === 'ios' ? 'black' : undefined} // (수정) 휠 글자색 검은색
            />
            
            {/* "취소", "확인" 버튼 (PotionPickerInput과 동일) */}
            <View style={styles.buttonRow}>
              <Button title="취소" onPress={handleCancel} color="red" />
              <Button title="확인" onPress={handleConfirm} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// --- 스타일 ---
// (PotionPickerInput과 거의 동일한 스타일)
const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
    fontFamily: 'Mulish-Regular',
  },
  inputText: {
    fontSize: 16,
    fontFamily: 'Mulish-Regular',
    color: '#000000',
  },
  placeholderText: {
    color: '#AAAAAA',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Mulish-Regular',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  // (새로 추가) DateTimePicker 휠의 크기
  picker: {
    width: '100%',
    height: 200,
  }
});