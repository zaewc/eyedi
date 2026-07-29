export const VC_TYPE_NAMES: Record<string, string> = {
  identitycard: '주민등록증',
  rsdcard: '주민등록증',
  rsdcdid: '주민등록증(재외국민)',
  mdriverlic: '자동차운전면허증',
  nmidentity: '국가유공자증',
  passportcert: '여권',
  ntqc: '국가기술자격증',
  prmntrsdcard: '영주증',
  ovkorrsdcard: '재외국민 국내거소신고증',
  indepatriot: '독립유공자',
  nationmerit: '국가유공자',
  demmerit: '5·18민주유공자',
  smmerit: '특수임무유공자',
  rewardpatrio: '보훈보상대상자',
  defoliantspa: '고엽제대상자',
  applicants: '지원대상자',
  dischasoldi: '제대군인',
  mdccard: '장애인등록증',
};

export function vcTypeName(code: string): string {
  return VC_TYPE_NAMES[code] ?? '알 수 없음';
}

export enum VcStatus {
  NORMAL = 0,
  EXPIRED = 1,
  SUSPENDED = 2,
  REVOKED = 3,
  LOST = 4,
}

export const VC_STATUS_LABEL: Record<VcStatus, string> = {
  [VcStatus.NORMAL]: '정상',
  [VcStatus.EXPIRED]: '만료',
  [VcStatus.SUSPENDED]: '정지',
  [VcStatus.REVOKED]: '폐기',
  [VcStatus.LOST]: '분실신고',
};

export interface BaseMobileId {
  vcId: string;
  vcType: string;
  vcStatus: VcStatus;
  issuerId: string;
  assertionCode: string;
  vcIssuanceDate: string;
  vcExpirationDate: string;
  idStatus: string;
  isDetailViewing: boolean;
  isMasking: boolean;
  isOnline: boolean;
  isSelected: boolean;
  lottie?: string;
}

export interface DriverLicense extends BaseMobileId {
  vcType: 'mdriverlic';
  name: string;
  birthday: string;
  sex: string;
  address: string;
  dlNo: string;
  asort: string;
  conditionCode: string;
  issuanceDate: string;
  issuerName: string;
  aptdInspectBegin: string;
  aptdInspectEnd: string;
  organDonation: number;
  ihidNum: string;
  photo?: string;
}

export interface ResidentCertificate extends BaseMobileId {
  vcType: 'identitycard';
  name: string;
  birthday: string;
  sex: string;
  address: string;
  ihidNum: string;
  issude: string;
  issuernm: string;
  foreignflag: string;
  photo?: string;
}

export interface ForeignResident extends BaseMobileId {
  vcType: 'prmntrsdcard' | 'ovkorrsdcard';
  name: string;
  engtitle: string;
  birth: string;
  address: string;
  cardsn: string;
  expireperiod: string;
  issude: string;
  engissuernm: string;
  ihidNum: string;
  photo?: string;
}

export interface NationalHonoree extends BaseMobileId {
  vcType: 'nationmerit' | 'indepatriot' | 'demmerit' | 'smmerit';
  name: string;
  birthday: string;
  address: string;
  ihidNum: string;
  issuanceDate: string;
  issuerName: string;
  photo?: string;
}

export type MobileId =
  | DriverLicense
  | ResidentCertificate
  | ForeignResident
  | NationalHonoree;

export interface VcMeta {
  vcId: string;
  isBound: boolean;
  vcStatusCode: number;
  expirationDate: string;
  vcTypeNumber: number;
  vcTypeNames: string;
  referenceCount: number;
}

export interface IssuableVc {
  vcType: string;
  title: string;
  description: string;
  issuer: string;
  available: boolean;
}

export interface UsageHistory {
  no: number;
  verifier: string;
  verifyDate: string;
  privacy: string;
}
