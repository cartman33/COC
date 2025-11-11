// React의 핵심 기능과 React Native의 'useState' 훅을 가져옵니다.
import React, { useState } from 'react';

// React Native에서 UI를 구성하는 데 필요한 기본 컴포넌트들을 가져옵니다.
import { 
  StyleSheet,  // CSS 대신 스타일을 정의하는 객체
  View,          // 웹의 <div> 태그와 같이 영역을 나누는 컴포넌트
  Text,          // 글자를 표시하는 컴포넌트
  Image,         // 이미지를 표시하는 컴포넌트
  TextInput,     // 사용자가 글자를 입력할 수 있는 입력창
  TouchableOpacity, // 사용자가 터치(클릭)할 수 있는 영역 (버튼)
  SafeAreaView,    // 아이폰의 노치(상단 카메라 영역) 등을 피해 안전 영역에만 UI를 표시
  Platform,        // OS(iOS, Android)에 따라 다르게 스타일을 적용할 때 사용
} from 'react-native';

// 1. 이미지 가져오기
// require를 사용해 'assets/images' 폴더에 있는 이미지 파일의 경로를 가져옵니다.
// (웹의 import coc from './coc.png'와 동일한 역할)
const cocLogo = require('../../assets/images/coc.png');
const footerImage = require('../../assets/images/footer.png'); 

// 'index.tsx'의 메인 컴포넌트입니다.
export default function HomeScreen() {

  // React 훅(Hook)을 사용해 사용자의 입력을 관리합니다.
  // [변수, 변수를_변경하는_함수] = useState('초기값');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [input3, setInput3] = useState(''); // 3번째 입력창
  const [input4, setInput4] = useState(''); // 4번째 입력창

  // 'Calculate' 버튼을 눌렀을 때 실행될 함수
  const onCalculatePress = () => {
    // 여기에 계산 로직을 추가합니다.
    console.log('Email:', email);
    console.log('Password:', password);
    // ...
    alert('계산 버튼이 눌렸습니다!');
  };

  // return (...) 안의 내용이 실제 화면에 표시됩니다.
  return (
    // SafeAreaView: 아이폰 노치나 하단 바를 피해 UI를 그립니다.
    <SafeAreaView style={styles.safeArea}>
      
      {/* <div className="main">을 <View style={styles.main}>으로 번역했습니다. */}
      {/* flex: 1은 이 View가 화면 전체를 차지하도록 합니다. (가장 중요) */}
      <View style={styles.main}>
        
        {/* --- 1. Header (헤더) --- */}
        {/* <header className="header">를 <View style={styles.header}>로 번역 */}
        <View style={styles.header}>
          
          {/* <img className="coc">를 <Image style={styles.cocLogo}>로 번역 */}
          {/* source={...}로 이미지 파일을 지정합니다. */}
          {/* resizeMode="contain"은 이미지가 잘리거나 찌그러지지 않고 비율에 맞게 축소됩니다. */}
          <Image source={cocLogo} style={styles.cocLogo} resizeMode="contain" />

          {/* <div className="subtitle">을 <Text style={styles.subtitle}>로 번역 */}
          <Text style={styles.subtitle}>Master Calculator</Text>
        </View>

        {/* --- 2. Body (입력창 영역) --- */}
        {/* <div className="frame">과 <div className="body">를 <View>로 번역 */}
        {/* React.js 코드의 Email, Password 컴포넌트 대신 기본 'TextInput'을 사용했습니다. */}
        <View style={styles.frame}>
          <View style={styles.body}>
            
            <TextInput
              style={styles.input} // 아래 StyleSheet에서 정의한 'input' 스타일 적용
              placeholder="이메일" // 입력창에 기본으로 보이는 안내 문구
              value={email} // 이 입력창의 값을 'email' 변수와 연결
              onChangeText={setEmail} // 글자가 변경될 때마다 'setEmail' 함수를 실행해 'email' 변수 업데이트
              keyboardType="email-address" // 이메일 입력용 키보드( @ 표시)
            />
            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true} // 입력한 글자를 '*'로 가려줌
            />
            <TextInput
              style={styles.input}
              placeholder="세 번째 입력"
              value={input3}
              onChangeText={setInput3}
            />
            <TextInput
              style={styles.input}
              placeholder="네 번째 입력"
              value={input4}
              onChangeText={setInput4}
            />

            {/* <SubmitButton>을 <TouchableOpacity>로 번역 */}
            {/* TouchableOpacity는 터치 시 투명도가 살짝 변해 '눌렀다'는 느낌을 줍니다. */}
            <TouchableOpacity style={styles.submitButton} onPress={onCalculatePress}>
              <Text style={styles.submitButtonText}>Calculate</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- 3. Footer (하단) --- */}
        {/* <footer className="footer">를 <View style={styles.footer}>로 번역 */}
        {/* 'a' 태그는 RN에 없으므로, 광고 링크는 제거하고 내용만 남겼습니다. */}
        <View style={styles.footer}>
          <Image source={footerImage} style={styles.footerImage} resizeMode="cover" />
          <Text style={styles.footerText}>Coding by CartMan33</Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

// --- StyleSheet (스타일 정의) ---
// 웹의 CSS 파일을 React Native의 JavaScript 객체로 번역한 것입니다.
// 'position: absolute' 대신 'flexbox'를 사용해 레이아웃을 재구성했습니다.
const styles = StyleSheet.create({
  // 최상위 안전 영역
  safeArea: {
    flex: 1, // 화면 전체를 차지
    backgroundColor: '#ffffff', // .main의 배경색
  },
  // 메인 컨테이너 (<div className="main">)
  main: {
    flex: 1, // safeArea 안을 꽉 채움
    alignItems: 'center', // 자식 요소들을 가로축(수평) 중앙에 정렬
    // 'justifyContent: space-between' // 헤더-중간-푸터를 위아래로 분산 (필요시 사용)
    paddingHorizontal: 20, // 좌우 여백
  },
  
  // 1. 헤더 영역 (<header className="header">)
  header: {
    width: '100%', // 가로 폭 100%
    alignItems: 'center', // 내부 요소들(로고, 서브타이틀)을 중앙 정렬
    marginTop: Platform.OS === 'android' ? 20 : 0, // 안드로이드일 때만 상단 여백
    paddingVertical: 20, // 위아래 여백
  },
  // coc 로고 (<img className="coc">)
  cocLogo: {
    width: 220, // CSS의 width
    height: 101, // CSS의 height
    // 'resizeMode: 'contain''은 위 JSX에서 설정
  },
  // 서브타이틀 (<div className="subtitle">)
  subtitle: {
    fontSize: 14, // CSS의 font-size
    color: '#000000', // CSS의 color
    marginTop: 10, // 로고와의 간격
    // 폰트(Mulish-Regular)는 Expo에 로드해야 적용됩니다.
  },

  // 2. 중간 영역 (<div className="frame">)
  frame: {
    width: '100%', // 가로 폭 100%
    alignItems: 'center', // 내부 'body'를 중앙 정렬
    marginVertical: 20, // 헤더 및 푸터와의 간격
  },
  // 입력창들을 감싸는 영역 (<div className="body">)
  body: {
    width: '100%', // 'frame'의 100%
    // 'gap: 40' 속성을 사용해 자식 요소(입력창)들 사이의 간격을 줍니다.
    // (CSS의 'gap: 40px'와 동일)
    gap: 20, // Figma CSS의 40px은 너무 넓어 20으로 조절했습니다.
  },
  // 입력창 (Email, Password 컴포넌트 대체)
  input: {
    width: '100%',
    height: 50, // 높이 지정
    borderWidth: 1, // 테두리 두께
    borderColor: '#cccccc', // 테두리 색상
    borderRadius: 8, // 테두리 둥글게
    paddingHorizontal: 15, // 안쪽 가로 여백
    fontSize: 16,
  },
  // 계산 버튼 (<SubmitButton> 대체)
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF', // Figma 디자인의 파란색 (임의 지정)
    borderRadius: 8,
    justifyContent: 'center', // 내부 텍스트를 세로 중앙 정렬
    alignItems: 'center', // 내부 텍스트를 가로 중앙 정렬
    marginTop: 20, // 마지막 입력창과의 간격
  },
  // 계산 버튼 텍스트
  submitButtonText: {
    color: '#ffffff', // 흰색 글자
    fontSize: 16,
    fontWeight: 'bold', // 굵은 글씨
  },

  // 3. 푸터 영역 (<footer className="footer">)
  footer: {
    width: '100%',
    alignItems: 'center', // 내부 요소들 중앙 정렬
    // 'marginTop: auto'는 flexbox의 속성으로, 이 요소를 부모의 맨 아래로 밀어냅니다.
    marginTop: 'auto',
    paddingBottom: 20, // 하단 여백
  },
  // 푸터 이미지 (<img className="image">)
  footerImage: {
    width: 100, // CSS의 width
    height: 100, // CSS의 height
  },
  // 푸터 텍스트 (<div className="text-wrapper">)
  footerText: {
    fontSize: 14,
    color: '#000000',
    marginTop: 10, // 이미지와의 간격
  },
});