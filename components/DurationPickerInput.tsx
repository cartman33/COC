// components/DurationPickerInput.tsx

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Props 타입 정의
type Duration = {
  days: number;
  hours: number;
  minutes: number;
};
type DurationPickerInputProps = {
  onDurationChange: (duration: Duration) => void;
};

// 숫자 배열 미리 생성
const DAYS = Array.from({ length: 31 }, (_, i) => i); // 0-30일
const HOURS = Array.from({ length: 24 }, (_, i) => i); // 0-23시
const MINUTES = Array.from({ length: 60 }, (_, i) => i); // 0-59분

export const DurationPickerInput: React.FC<DurationPickerInputProps> = ({ onDurationChange }) => {
  
  // (수정) '확인' 버튼 로직을 위해 임시 State 추가
  const [isModalVisible, setModalVisible] = useState(false);
  // 최종 선택된 값
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  // Picker에서 임시로 선택 중인 값
  const [tempDay, setTempDay] = useState(0);
  const [tempHour, setTempHour] = useState(0);
  const [tempMinute, setTempMinute] = useState(0);

  // 모달을 열 때, 현재 최종 값을 임시 값으로 설정
  const openModal = () => {
    setTempDay(selectedDay);
    setTempHour(selectedHour);
    setTempMinute(selectedMinute);
    setModalVisible(true);
  };

  // 사용자가 "확인" 눌렀을 때
  const handleConfirm = () => {
    // 임시 값을 최종 값으로 확정
    setSelectedDay(tempDay);
    setSelectedHour(tempHour);
    setSelectedMinute(tempMinute);
    
    const duration = {
      days: tempDay,
      hours: tempHour,
      minutes: tempMinute,
    };
    onDurationChange(duration); // 1. 부모(index.tsx)에게 보고
    setModalVisible(false);     // 2. 모달 닫기
  };

  // "취소" 버튼을 눌렀을 때
  const handleCancel = () => {
    setModalVisible(false);
  };

  // 선택된 값을 텍스트로 표시
  const getSelectedText = () => {
    const totalMinutes = (selectedDay * 24 * 60) + (selectedHour * 60) + selectedMinute;
    if (totalMinutes === 0) {
      return '소요 시간';
    }
    return `${selectedDay}일 ${selectedHour}시간 ${selectedMinute}분`;
  };

  return (
    <View style={{ width: '100%' }}>
      {/* 입력창처럼 보이는 버튼 */}
      {/* (수정) onPress 시 openModal 함수 호출 */}
      <TouchableOpacity style={styles.input} onPress={openModal}>
        <Text style={styles.inputText}>{getSelectedText()}</Text>
      </TouchableOpacity>

      {/* 팝업 모달 */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>소요 시간 선택</Text>
            
            <View style={styles.pickerRow}>
              {/* --- (핵심 수정) --- */}
              {/* 모든 Picker에 itemStyle과 height를 적용합니다. */}
              
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={tempDay}
                  onValueChange={(itemValue) => setTempDay(itemValue)}
                  style={styles.picker} // style에 height가 포함됨
                  itemStyle={styles.pickerItem} // itemStyle 적용
                >
                  {DAYS.map((day) => (
                    <Picker.Item key={day} label={`${day}일`} value={day} />
                  ))}
                </Picker>
              </View>
              
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={tempHour}
                  onValueChange={(itemValue) => setTempHour(itemValue)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {HOURS.map((hour) => (
                    <Picker.Item key={hour} label={`${hour}시간`} value={hour} />
                  ))}
                </Picker>
              </View>
              
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={tempMinute}
                  onValueChange={(itemValue) => setTempMinute(itemValue)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {MINUTES.map((min) => (
                    <Picker.Item key={min} label={`${min}분`} value={min} />
                  ))}
                </Picker>
              </View>
            </View>
            
            {/* (수정) 버튼 영역 추가 */}
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
const styles = StyleSheet.create({
  // (input, inputText 스타일은 기존과 동일)
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
  pickerRow: {
    flexDirection: 'row',
    width: '100%',
  },
  pickerContainer: {
    flex: 1,
  },
  // (수정) Picker 스타일에 height 추가
  picker: {
    height: 200,
  },
  // (수정) Picker Item 스타일에 color 추가
  pickerItem: {
    color: 'black',
    fontFamily: 'Mulish-Regular',
    fontSize: 16
  },
  // (수정) 버튼을 가로로 배치하기 위한 스타일
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  }
});