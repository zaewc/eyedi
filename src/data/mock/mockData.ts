import {
  DriverLicense,
  ResidentCertificate,
  IssuableVc,
  UsageHistory,
  VcStatus,
  MobileId,
} from '@/types';

export const mockDriverLicense: DriverLicense = {
  vcId: 'vc-dl-0001',
  vcType: 'mdriverlic',
  vcStatus: VcStatus.NORMAL,
  issuerId: 'did:omn:koroad',
  assertionCode: 'assert-dl-01',
  vcIssuanceDate: '2023-04-16',
  vcExpirationDate: '2033-04-15',
  idStatus: '정상',
  isDetailViewing: false,
  isMasking: true,
  isOnline: true,
  isSelected: false,
  name: '송재욱',
  birthday: '2002-07-28',
  sex: '남',
  address: '광주전남통합특별시 남구 봉선중앙로 46, 107동 1001호 (봉선동, 삼익아파트)',
  dlNo: '11-90-123456-01',
  asort: '제1종 보통',
  conditionCode: '',
  issuanceDate: '2023-04-16',
  issuerName: '서울지방경찰청장',
  aptdInspectBegin: '2032-01-01',
  aptdInspectEnd: '2032-12-31',
  organDonation: 0,
  ihidNum: '020728-3553310',
};

export const mockResidentCertificate: ResidentCertificate = {
  vcId: 'vc-rc-0001',
  vcType: 'identitycard',
  vcStatus: VcStatus.NORMAL,
  issuerId: 'did:omn:mois',
  assertionCode: 'assert-rc-01',
  vcIssuanceDate: '2022-11-10',
  vcExpirationDate: '2032-11-09',
  idStatus: '정상',
  isDetailViewing: false,
  isMasking: true,
  isOnline: true,
  isSelected: false,
  name: '송재욱',
  birthday: '2002-07-28',
  sex: '남',
  address: '광주전남통합특별시 남구 봉선중앙로 46, 107동 1001호 (봉선동, 삼익아파트)',
  ihidNum: '020728-3553310',
  issude: '2022-11-10',
  issuernm: '광주광역시 남구청장',
  foreignflag: 'N',
};

export const mockIssuableVcs: IssuableVc[] = [
  {
    vcType: 'mdriverlic',
    title: '자동차운전면허증',
    description: '경찰청(도로교통공단) 발급',
    issuer: '도로교통공단',
    available: true,
  },
  {
    vcType: 'identitycard',
    title: '주민등록증',
    description: '행정안전부 발급',
    issuer: '행정안전부',
    available: true,
  },
  {
    vcType: 'ntqc',
    title: '국가기술자격증',
    description: '한국산업인력공단 발급',
    issuer: '한국산업인력공단',
    available: true,
  },
  {
    vcType: 'nationmerit',
    title: '국가유공자증',
    description: '국가보훈부 발급',
    issuer: '국가보훈부',
    available: true,
  },
  {
    vcType: 'prmntrsdcard',
    title: '외국인등록증',
    description: '법무부 발급',
    issuer: '법무부',
    available: false,
  },
];

export const issuedSampleByType: Record<string, MobileId> = {
  mdriverlic: mockDriverLicense,
  identitycard: mockResidentCertificate,
};

export const mockUsageHistory: UsageHistory[] = [
  {
    no: 1,
    verifier: 'CU 편의점 (성인인증)',
    verifyDate: '2026-08-04 21:12',
    privacy: '성인여부',
  },
  {
    no: 2,
    verifier: '카카오뱅크 (계좌개설)',
    verifyDate: '2026-08-02 14:30',
    privacy: '성명, 생년월일, 주소',
  },
  {
    no: 3,
    verifier: '인천공항 자동출입국심사',
    verifyDate: '2026-07-28 09:05',
    privacy: '성명, 생년월일, 사진',
  },
  {
    no: 4,
    verifier: 'GS25 (주류 구매)',
    verifyDate: '2026-07-20 19:44',
    privacy: '성인여부',
  },
];

export const mockNotices = [
  {
    id: 'n1',
    title: '[안내] 모바일 신분증 서비스 점검 안내',
    date: '2026-08-01',
    body: '보다 안정적인 서비스 제공을 위해 시스템 점검을 실시합니다. 점검 시간 동안 일부 기능 이용이 제한될 수 있습니다.',
  },
  {
    id: 'n2',
    title: '[업데이트] 국가기술자격증 발급 지원',
    date: '2026-07-15',
    body: '이번 업데이트부터 국가기술자격증을 모바일 신분증으로 발급받을 수 있습니다.',
  },
];
