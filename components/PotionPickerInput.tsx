// components/PotionPickerInput.tsx

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Props 타입 정의
type PotionPickerInputProps = {
  onCountChange: (count: number) => void;
};

// 1부터 100까지의 숫자 배열 (미리 생성)
const potionCounts = Array.from({ length: 100 }, (_, i) => i + 1);

export const PotionPickerInput: React.FC<PotionPickerInputProps> = ({ onCountChange }) => {
  
  // 내부 State
  // (수정) 사용자가 '확인'을 눌러야 값이 바뀌도록 임시 State 'tempCount'를 추가합니다.
  const [selectedCount, setSelectedCount] = useState(1); // 최종 선택된 값
  const [tempCount, setTempCount] = useState(selectedCount); // Picker에서 임시로 선택 중인 값
  const [isModalVisible, setModalVisible] = useState(false);

  // Picker 모달을 열 때, 현재 최종 값을 임시 값으로 설정
  const openModal = () => {
    setTempCount(selectedCount);
    setModalVisible(true);
  };

  // "확인" 버튼을 눌렀을 때
  const handleConfirm = () => {
    setSelectedCount(tempCount); // 임시 값을 최종 값으로 확정
    onCountChange(tempCount);      // 1. 부모(index.tsx)에게 보고
    setModalVisible(false);        // 2. 모달 닫기
  };

  // "취소" 버튼을 눌렀을 때
  const handleCancel = () => {
    setModalVisible(false);
    // 임시 값을 버리고, 원래 값으로 둡니다.
  };

  // (수정) placeholder 로직을 좀 더 명확하게
  const getSelectedText = () => {
    if (selectedCount === 1 && !isModalVisible) {
      // 이 부분은 초기 값이 1일 때 placeholder를 어떻게 보여줄지 정해야 합니다.
      // 우선 1개로 표시되도록 수정합니다.
      return `${selectedCount} 개`; 
    }
    return `${selectedCount} 개`;
  };

  return (
    <View style={{ width: '100%' }}>
      {/* 입력창처럼 보이는 버튼 */}
      {/* (수정) onPress 시 openModal 함수 호출 */}
      <TouchableOpacity style={styles.input} onPress={openModal}>
        <Text style={styles.inputText}>
          {selectedCount === 0 ? '사용할 장인 포션 개수' : `${selectedCount} 개`}
        </Text>
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
            <Text style={styles.modalTitle}>포션 개수 선택</Text>
            
            {/* --- (핵심 수정) --- */}
            <Picker
              // (수정) 임시 값(tempCount)을 사용
              selectedValue={tempCount}
              onValueChange={(itemValue) => setTempCount(itemValue)}
              // (수정) 1. Picker의 높이를 200으로 지정
              style={{ width: '100%', height: 200 }} 
              // (수정) 2. item의 글자색을 검은색으로 강제 지정
              itemStyle={{ color: 'black', fontFamily: 'Mulish-Regular', fontSize: 18 }} 
            >
              {potionCounts.map((count) => (
                <Picker.Item key={count} label={`${count} 개`} value={count} />
              ))}
            </Picker>
            
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
  // (수정) 버튼을 가로로 배치하기 위한 스타일
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  }
});