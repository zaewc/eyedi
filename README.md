# 모바일 신분증 v2 (Expo / React Native)

`v1/`(디컴파일된 안드로이드 앱 `kr.go.mobileid`, v5.5.0)을 **React Native (Expo)** 로 마이그레이션한 프로젝트입니다.

> ⚠️ 이 프로젝트는 v1의 **구조·화면·플로우를 학습/재현**하기 위한 것으로, 실제 정부 백엔드에 연결하지 않습니다.
> 모든 서버 통신은 **mock** 으로 동작하며, 어떤 실제 개인정보도 수집·전송하지 않습니다.

## 실행 방법

```bash
cd v2
npm install
# 버전 정합성 보정(권장)
npx expo install --fix

# 실행
npx expo start          # QR 스캔 후 Expo Go 또는 개발빌드에서 실행
# 또는
npx expo start --ios
npx expo start --android
```

- QR 스캔·생체인증은 **실기기 또는 개발빌드**에서 정상 동작합니다. (Expo Go에서도 대부분 동작)
- 카메라 없이도 QR 스캔 화면의 **"데모 QR로 계속"** 버튼으로 검증 플로우를 확인할 수 있습니다.

## 구현된 핵심 플로우 (end-to-end)

스플래시 → 온보딩 → 약관동의 → 본인확인 → PIN 설정 → 생체등록 → **메인 지갑** →
신분증 발급 → 카드 상세 → **QR 제시(CPM)** / **QR 스캔·검증(MPM)** → 이용내역 → 설정/분실신고

| 플로우 | 화면 | v1 대응 |
|---|---|---|
| 진입 | `SplashScreen` | `SplashFragment` |
| 온보딩 | `OnboardingScreen`, `TermsScreen` | `onboard/`, `AgreeDialog`, `LglrepAgre` |
| 본인확인 | `PhoneAuthScreen` | `auth/AuthFragment`, `AuthNumberDialog` |
| 비밀번호 | `SetPinScreen`, `LockScreen` | `password/`, `PasswordActivity` |
| 생체인증 | `BiometricSetupScreen` | `auth/FingerprintActivity`, `FaceAuthActivity` |
| 지갑/발급 | `WalletScreen`, `ApplyScreen` | `main/MainFragment`, `IssuableTabFragment` |
| 발급 | `IssueConfirm/Loading/Complete` | `issue/` |
| 상세 | `IdDetailScreen` | `menu/IdDetailFragment` |
| 제시/검증 | `PresentQR`, `ScanQR`, `VerifyConfirm`, `VerifyComplete` | `verify/` |
| 메뉴 | `MenuScreen`, `SettingsScreen`, `UsageHistoryScreen`, `ServiceCenterScreen`, `LossReportScreen`, `NoticeScreen` | `menu/`, `loss/`, `notice/` |
| 웹뷰 | `WebScreen` | `web/WebActivity` |

## 아키텍처 (v1 → v2 매핑)

```
v1 (Android/Kotlin, MVVM)              v2 (Expo/RN + TS)
────────────────────────────────────────────────────────────
MainActivity + NavHostFragment    →  App.tsx + RootNavigator (React Navigation)
Fragment / Activity               →  screens/*
ViewModel                         →  zustand store + 화면 로컬 상태
data/source/http/*HttpService     →  data/services/*Service (mock)
data/model/**                     →  src/types/**
Room DB / SharedPreferences       →  AsyncStorage + SecureStore (store/)
common/ (커스텀 뷰/다이얼로그)    →  components/common/*
```

- 상태관리: **zustand** (`authStore`, `walletStore`)
- 영속화: 발급 신분증·이용내역은 `AsyncStorage`, PIN은 `expo-secure-store`
- 네비게이션: `@react-navigation/native-stack` + `bottom-tabs`

## v1 대비 제외/대체된 부분 (요청: 보안 스택 제외 + Expo 기술 제약)

`MIGRATION_NOTES.md` 에 상세 정리되어 있습니다. 요약:

| 항목 | v1 | v2 처리 |
|---|---|---|
| 보안 SDK (mVaccine, TouchEn AntiCapture, TransKey) | RaonSecure/SoftSecurity | **제외** (요청) — PIN은 일반 키패드로 대체 |
| DID/VC/ZKP crypto (OmniOne SDK, BouncyCastle) | 블록체인 DID 서명 | **미구현** — VP는 mock payload |
| 실제 백엔드 (`*.mobileid.go.kr`) | REST/gRPC | **mock** (`data/services/`) |
| NFC HCE (카드 에뮬레이션) | `MiaApduService` | **미지원** (Expo 제약) — stub |
| BLE 제시 (Peripheral) | `BlePeripheralManager` | **미지원** (RN 제약) — stub |
| 얼굴 인증 (ML Kit) | `auth/face/` | **간이 대체** — expo-local-authentication(생체) |
| 실제 신분증 이미지/리소스 | resources.arsc | 복원 불가 — 브랜드 근접 색상/플레이스홀더 |

## 폴더 구조

```
v2/
├─ App.tsx, index.ts
├─ app.json, package.json, tsconfig.json, babel.config.js
└─ src/
   ├─ theme/         # 디자인 토큰 (colors, typography, spacing)
   ├─ types/         # 데이터 모델 (id, verify, http) — v1 미러링
   ├─ data/
   │  ├─ mock/       # 데모 데이터
   │  ├─ services/   # HttpService/VpvService (mock) + endpoints
   │  └─ store/      # zustand (auth, wallet)
   ├─ components/     # IdCard + common (Button/Dialog/Header/PinPad ...)
   ├─ navigation/     # RootNavigator, MainTabs, types
   └─ screens/        # 화면 (onboard/auth/password/main/issue/verify/menu/web)
```
