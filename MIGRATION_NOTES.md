# 마이그레이션 노트 (v1 → v2)

v1 = 디컴파일된 안드로이드 앱 `kr.go.mobileid` (모바일 신분증 v5.5.0, versionCode 382)
v2 = 이 Expo/React Native 재구현

사용자 요청 방향:
- 핵심 플로우 **end-to-end** 동작 우선
- 백엔드는 **mock**
- UI는 **한국어 + v1 디자인 최대 근접**
- **보안 스택 제외**

---

## 1. v1 아키텍처 요약 (분석 결과)

- 패키지 `kr.go.mobileid`, Application `mip.mia.MIApplication`, 단일 `MainActivity` + Fragment 기반 MVVM
- 화면 ~130개(Fragment/Activity/Dialog), ViewModel 29개, Activity 44개
- 신분증은 **W3C DID/VC** 기반. 제시 채널: **QR / BLE / NFC(HCE)**. 발급/인증: 얼굴·생체·PIN
- 백엔드: `mia / cag / pub / bcg / bcc / exs / www .mobileid.go.kr`
- 보안: RaonSecure OmniOne(DID SDK), mVaccine(앱보호), TouchEn AntiCapture(캡처방지),
  SoftSecurity TransKey(보안키패드), BouncyCastle/SpongyCastle(+PQC)

## 2. 매핑 원칙

| v1 개념 | v2 대응 |
|---|---|
| Activity / Fragment | `src/screens/*` (React Navigation 스택/탭) |
| ViewModel (LiveData/StateFlow) | zustand store + 화면 로컬 `useState` |
| Repository / HttpService | `src/data/services/*` (mock, 시그니처는 실제 모델 준수) |
| data class (VC 모델) | `src/types/id.ts` 인터페이스 |
| VerifyConst / VP 프로토콜 | `src/types/verify.ts` (상수 그대로 이식) |
| Room DB / SharedPreferences | `AsyncStorage` + `expo-secure-store` |
| 커스텀 View / Dialog | `src/components/common/*` |

## 3. 데이터 모델 이식 (v1 → src/types)

- `mip.mia.data.model.id.BaseMobileId` → `BaseMobileId`
- `DriverLicense`, `ResidentCertificate`, `ForeignResident`, `NationalHonoree` → 동명 인터페이스
- `VcMeta`, `IssuableVC`, `UsageHistory` → 동명 인터페이스
- `VcMapper`(코드→한글 명칭) → `VC_TYPE_NAMES` / `vcTypeName()`
- `VerifyConst`(모드/메시지/버전 상수) → `VerifyConst` 객체로 그대로 이식

## 4. 완전히 동일하게 재현 **불가**한 항목과 사유

### 4-1. 보안 스택 (요청에 따라 제외)
- **RaonSecure mVaccine / TouchEn AntiCapture / SoftSecurity TransKey**: 상용 네이티브 SDK.
  v2에서는 미포함. PIN 입력은 `components/common/PinPad`(셔플 옵션만 유사)로 대체.

### 4-2. DID / VC / ZKP 암호 (미구현)
- v1은 OmniOne SDK로 DID 키 생성·VC 서명·ZKP 증명을 수행(EOSIO 계열 블록체인 연동).
- v2의 VP는 서명 없는 **평문 mock payload**(`vpvService.createPresentationPayload`).
- 실제화하려면: 키관리(SecureEnclave/StrongBox), VC 서명 검증, DID Document 조회가 필요.

### 4-3. 실제 백엔드 (mock)
- `*.mobileid.go.kr` 서버는 인증 없이 접근 불가하고 스펙도 공개되지 않음.
- `data/services/endpoints.ts` 에 **실제 도메인/URL을 문서화**만 해두고,
  호출부는 `httpService.ts` / `vpvService.ts` 의 mock 이 지연을 두고 응답.
- 실제 연동 시: 각 mock 함수를 `fetch(HOSTS.xxx + path)` 로 교체하면 됨.

### 4-4. NFC HCE (미지원 — Expo/RN 제약)
- v1 `mip.mia.data.source.nfc.MiaApduService`는 **HostApduService**(카드 에뮬레이션).
- Expo managed 및 대부분의 RN 라이브러리는 HCE 미지원. 재현하려면 안드로이드 네이티브 모듈 + 커스텀 개발빌드 필요.
- v2에서는 해당 진입점을 두지 않음(stub).

### 4-5. BLE 제시 (미지원 — RN 제약)
- v1 `BlePeripheralManager`는 BLE **Peripheral(주변장치)** 모드로 mDL을 제시(ISO 18013-5 유사).
- `react-native-ble-plx` 등 주요 RN BLE 라이브러리는 Central 모드 위주로, Peripheral 광고는 미지원/불안정.
- v2는 QR(CPM/MPM)만 구현.

### 4-6. 얼굴 인증 (간이 대체)
- v1 `auth/face/`는 ML Kit Face Detection + 서버 대조(RegisterFace/AuthFace).
- v2는 `expo-local-authentication`(지문/Face ID)로 대체. 별도 얼굴 촬영·대조는 미구현.

### 4-7. 리소스 (부분 복원)
- JADX가 `resources.arsc`를 완전 복원하지 못해 정확한 색상값/문자열/이미지 확보 불가.
- v2는 공식 브랜드(정부 블루)에 근접한 팔레트(`theme/colors.ts`)와 이모지 플레이스홀더 사용.

## 5. 남은 화면(브레드스크럼)
v1의 130여 화면 중 **핵심 플로우**를 우선 구현했다. 아직 옮기지 않은 대표 화면:
- 지갑 전환/이관 (`conversion/` — WalletConversion*)
- IC카드/여권 NFC 발급 (`issue/IcCard*`, `MRZCameraActivity`)
- 2차 인증/분실취소 상세 (`loss/Method2ndAuth`, `Register2ndAuth`)
- 시니어 모드, 언어 변경(i18n) 등

이들은 위 아키텍처(스크린 추가 + store/service 확장) 그대로 확장하면 된다.
