// components/PotionPickerInput.tsx

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

/**
 * (수정) Props 타입 정의
 * 부모로부터 'value' (현재 값)를 받도록 추가합니다.
 */
type PotionPickerInputProps = {
  value: number; // 부모(index.tsx)가 관리하는 현재 값
  onCountChange: (count: number) => void;
};

// 1부터 100까지의 숫자 배열 (미리 생성)
const potionCounts = Array.from({ length: 100 }, (_, i) => i + 1);

/**
 * (수정) PotionPickerInput 컴포넌트
 * 이제 부모로부터 'value'를 전달받습니다.
 */
export const PotionPickerInput: React.FC<PotionPickerInputProps> = ({ value, onCountChange }) => {
  
  // tempCount는 모달(팝업) 안에서만 사용할 임시 값입니다.
  const [tempCount, setTempCount] = useState(value === 0 ? 1 : value);
  const [isModalVisible, setModalVisible] = useState(false);

  // Picker 모달을 열 때, 부모의 현재 값(value)으로 임시 값을 설정
  const openModal = () => {
    // 부모의 값이 0(선택안함)이면 1을, 아니면 그 값을 기본으로
    setTempCount(value === 0 ? 1 : value);
    setModalVisible(true);
  };

  // "확인" 버튼을 눌렀을 때
  const handleConfirm = () => {
    // 임시 값(tempCount)을 부모(index.tsx)에게 바로 보고합니다.
    onCountChange(tempCount);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ width: '100%' }}>
      {/* 입력창처럼 보이는 버튼 */}
      <TouchableOpacity style={styles.input} onPress={openModal}>
        
        {/*
          (수정) 표시되는 텍스트
          이제 부모로부터 받은 'value' prop을 기준으로 텍스트를 표시합니다.
          value가 0이면(선택 안 됨) placeholder(회색)를 보여줍니다.
        */}
        <Text style={[
            styles.inputText,
            value === 0 && styles.placeholderText // value가 0이면 회색으로
        ]}>
          {value === 0 ? '사용할 장인 포션 개수' : `${value} 개`}
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
            
            <Picker
              selectedValue={tempCount}
              onValueChange={(itemValue) => setTempCount(itemValue)}
              style={{ width: '100%', height: 200 }} 
              itemStyle={{ color: 'black', fontFamily: 'Mulish-Regular', fontSize: 18 }} 
            >
              {potionCounts.map((count) => (
                <Picker.Item key={count} label={`${count} 개`} value={count} />
              ))}
            </Picker>
            
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
  // (새로 추가) value가 0일 때 (placeholder일 때) 적용할 스타일
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
  }
});