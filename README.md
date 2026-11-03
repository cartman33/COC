# 🏰 Clash of Clans Master Calculator

> **클래시 오브 클랜(CoC) 장인 포션 가속 효과 및 업그레이드 완료 시각 정밀 계산 모바일 앱**

---

### 1. 아이템, 문제인식 | 접근 방식 | 어떤 단계를 거치게 되었는지

* **기존 문제 인식**
  * 클래시 오브 클랜(CoC)에서 건물 및 영웅의 업그레이드는 수일에서 수십 일이 소요됩니다.
  * 게임 내 핵심 아이템인 **장인 포션(1시간 동안 작업 속도 10배 가속, 포션 1개당 실질 9시간 단축)** 을 여러 개 사용할 경우, **"업그레이드가 정확히 언제 끝나는지"** 게임 내 인터페이스만으로는 직관적으로 파악하기 어렵습니다.
  * 완료 시점이 수면 시간이나 업무 시간 중일 경우 자원이 넘치거나 장인이 유휴 상태(Idle)로 방치되어 마을 성장 속도가 지체되는 비효율이 발생했습니다.

* **접근 방식**
  * **기준 시간(현재/임의 시각), 소요 기간(일/시/분), 사용할 장인 포션 개수**를 직관적인 모바일 피커(Picker)로 입력하면, 포션의 가속 로직을 자동으로 계산하여 **최종 완료 날짜와 시각을 정확히 산출해 주는 모바일 전용 계산기**를 기획 및 구현하였습니다.
  * 초기 Figma 웹 프로토타입 마크업에서 시작하여, 실제 모바일 환경에서 쾌적하게 동작할 수 있도록 **React Native & Expo 기반의 크로스 플랫폼 애플리케이션**으로 전환하였습니다.

* **어떤 단계를 거치게 되었는지**
  1. **Figma UI 디자인 & 프로토타입 설계**: 모바일 환경에 적합한 로고 배치, 입력 필드 및 버튼 레이아웃 기획
  2. **React Native / Expo 환경 전환**: 웹 기반 절대좌표 스타일에서 모바일 네이티브 레이아웃으로 전면 전환
  3. **컴포넌트 모듈화 & 상태 아키텍처 개선**: 복잡한 모달/피커 상태를 하위 컴포넌트로 캡슐화하고 상위 컴포넌트는 결과 데이터만 단방향으로 수신하도록 리팩토링
  4. **비동기 폰트 로딩 및 플랫폼 대응**: 커스텀 폰트(Mulish) FOUT 방지 및 iOS/Android 노치 대응 스타일링 완료

---

### 2. 기간

* **2025.11 ~ 2025.12** *(실제 진행 일정에 맞게 수정 가능)*

---

### 3. 역할

* **1인 개발 (개인 프로젝트)**
  * 프로젝트 기획, UI/UX 디자인(Figma 활용)
  * 프론트엔드 모바일 앱 아키텍처 설계 및 구현 (React Native / Expo / TypeScript)

---

### 4. 기여, 기술적 어려움을 어떻게 해결하였으며, 이때 본인의 기여도

* **컴포넌트 관심사 분리(Separation of Concerns)를 통한 상태 관리 최적화**
  * 초기에는 메인 화면 하나에서 모든 피커(Picker)의 모달 열림/닫힘(`isModalVisible`)과 입력 상태를 관리하여 코드 복잡도가 높고 불필요한 리렌더링이 발생했습니다.
  * 이를 `TimePickerInput`, `PotionPickerInput`, `DurationPickerInput` 3개의 독립된 커스텀 컴포넌트로 분리하고 모달 UI 상태를 자체적으로 캡슐화하도록 설계했습니다.
  * 최상위 `HomeScreen`은 순수 결과 값(`currentTime`, `potionCount`, `duration`)만을 콜백 함수(`onTimeChange`, `onDurationChange` 등)를 통해 수신하는 단방향 데이터 흐름을 확립하여 유지보수성을 극대화했습니다.

* **웹 마크업(Anima 기반 절대좌표)을 React Native 네이티브 레이아웃으로 전면 재설계**
  * Figma 익스포트 코드의 절대 좌표(`position: absolute`, `calc()`) 및 고정 픽셀 레이아웃 문제를 해결하기 위해 React Native의 Flexbox 기반 `StyleSheet`로 전면 재작성했습니다.
  * `SafeAreaView`와 `Platform.OS` 분기 로직을 적용하여 iOS 노치 및 Android 상태 표시줄 영역에 따른 레이아웃 깨짐을 방어했습니다.

* **Expo 커스텀 폰트 비동기 로딩 제어 및 FOUT(Flash of Unstyled Text) 방지**
  * 프로젝트 전반에 사용된 'Mulish' 커스텀 폰트가 렌더링되기 전 텍스트 깜빡임이나 에러가 발생하는 문제를 해결하기 위해, Expo Router의 루트 레이아웃(`_layout.tsx`)에서 `expo-font`의 `useFonts` 훅을 활용했습니다.
  * 폰트 리소스 로드가 완료되기 전까지 화면 렌더링을 지연(`return null`)시키는 방어 코드를 구현하여 일관되고 완성도 높은 UI 렌더링을 보장했습니다.

* **TypeScript 기반의 엄격한 데이터 모델링**
  * 소요 시간 처리를 위해 `Duration` 타입(`{ days: number; hours: number; minutes: number }`)을 명시적으로 정의하고, 부모-자식 컴포넌트 간 전달되는 Props와 State의 타입을 일치시켜 런타임 타입 오류를 사전에 차단했습니다.

---

### 5. 사진

| 메인 화면 로고 | 푸터 브랜딩 | 앱 실행 화면 (예시) |
| :---: | :---: | :---: |
| <img src="./coc.png" width="220" /> | <img src="./footer.png" width="100" /> | *(실제 실행 캡처 이미지 등록)* |

---

### 🛠 Tech Stack

* **Framework**: React Native, Expo (Expo Router)
* **Language**: TypeScript, JavaScript
* **Styling**: React Native StyleSheet, Custom Font (Mulish)
* **Design/Tool**: Figma, Git
