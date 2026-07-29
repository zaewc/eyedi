export const VerifyConst = {

  MODE_QR_CPM: 'cpm',
  MODE_QR_MPM: 'mpm',
  MODE_DIRECT: 'direct',
  MODE_INDIRECT: 'indirect',
  MODE_PROXY: 'proxy',
  MODE_PUSH: 'mode_push',
  MODE_APP2APP: 'mode_app2app',
  MODE_BLE_CPM: 'mode_ble_cpm',
  MODE_BLE_MPM: 'mode_ble_mpm',
  MODE_BLE_DIRECT: 'ble_direct',

  CMD_150: '150',
  CMD_200: '200',
  CMD_210: '210',

  MSG_ACK: 'ack',
  MSG_ERROR: 'error',
  MSG_FINISH: 'finish',
  MSG_PROFILE: 'profile',
  MSG_VP: 'vp',
  MSG_PASSWORD: 'password',
  MSG_PASSWORD_CONFIRM: 'password_confirm',
  MSG_WAIT_JOIN: 'wait_join',
  MSG_WAIT_VERIFY: 'wait_verify',

  PRESENT_DID_AUTH: 0,
  PRESENT_DID_VP: 1,
  PRESENT_ZKP_VP: 2,

  VERSION_100: '1.0.0',
  VERSION_110: '1.1.0',
  VERSION_200: '2.0.0',
} as const;

export type PresentMode = typeof VerifyConst.MODE_QR_CPM | typeof VerifyConst.MODE_QR_MPM;

export interface RequestedClaim {
  key: string;
  label: string;
  required: boolean;
}

export interface VerifyProfile {
  trxCode: string;
  verifier: string;
  verifierLogo?: string;
  purpose: string;
  requestedClaims: RequestedClaim[];
  mode: PresentMode;
}

export interface VerifiablePresentation {
  trxCode: string;
  vcId: string;
  vcType: string;
  disclosedClaims: Record<string, string>;
  createdAt: string;
}

export interface VerifyResult {
  success: boolean;
  trxCode: string;
  verifier: string;
  verifiedAt: string;
  message?: string;
}
