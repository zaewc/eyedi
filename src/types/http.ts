export interface BaseResponse<T = unknown> {
  resultCode: string;
  resultMessage: string;
  data?: T;
}

export const RESULT_OK = '0000';

export interface GetVersionResp {
  latestVersion: string;
  minVersion: string;
  forceUpdate: boolean;
  storeUrl: string;
}

export interface Tos {
  tosId: string;
  title: string;
  content: string;
  required: boolean;
  agreed: boolean;
}

export interface CreateNonceResp {
  nonce: string;
  expiresAt: string;
}

export interface GenAuthDataResp {
  authTxId: string;
  telecom: string;
}

export interface SendAuthNumberResp {
  authTxId: string;
  timeoutSec: number;
}

export interface IssueMRCResp {
  vcId: string;
  vcType: string;
  status: string;
}
