import {
  BaseResponse,
  RESULT_OK,
  GetVersionResp,
  Tos,
  SendAuthNumberResp,
  IssuableVc,
  MobileId,
} from '@/types';
import { mockIssuableVcs, issuedSampleByType } from '@/data/mock/mockData';

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

function ok<T>(data: T): BaseResponse<T> {
  return { resultCode: RESULT_OK, resultMessage: '성공', data };
}

export const AppHttpService = {

  async getVersion(): Promise<BaseResponse<GetVersionResp>> {
    await delay(400);
    return ok({
      latestVersion: '5.5.0',
      minVersion: '5.0.0',
      forceUpdate: false,
      storeUrl: 'https://play.google.com/store/apps/details?id=kr.go.mobileid',
    });
  },

  async getTos(): Promise<BaseResponse<Tos[]>> {
    await delay(300);
    return ok([
      { tosId: 't1', title: '(필수) 모바일 신분증 이용약관', content: '제1조(목적)...', required: true, agreed: false },
      { tosId: 't2', title: '(필수) 개인정보 수집·이용 동의', content: '수집항목: 성명, 생년월일...', required: true, agreed: false },
      { tosId: 't3', title: '(필수) 고유식별정보 처리 동의', content: '주민등록번호 등...', required: true, agreed: false },
      { tosId: 't4', title: '(선택) 마케팅 정보 수신 동의', content: '이벤트/혜택 안내...', required: false, agreed: false },
    ]);
  },

  async sendAuthNumber(phone: string): Promise<BaseResponse<SendAuthNumberResp>> {
    await delay(600);
    return ok({ authTxId: `tx-${phone.slice(-4)}`, timeoutSec: 180 });
  },

  async verifyAuthNumber(authTxId: string, code: string): Promise<BaseResponse<boolean>> {
    await delay(500);
    if (code === '000000' || code.length === 6) return ok(true);
    return { resultCode: 'E401', resultMessage: '인증번호가 일치하지 않습니다.', data: false };
  },
};

export const CagHttpService = {

  async getIssuableList(): Promise<BaseResponse<IssuableVc[]>> {
    await delay(400);
    return ok(mockIssuableVcs);
  },

  async issueVc(vcType: string): Promise<BaseResponse<MobileId | null>> {
    await delay(1500);
    const sample = issuedSampleByType[vcType];
    if (!sample) {
      return { resultCode: 'E404', resultMessage: '현재 발급할 수 없는 신분증입니다.', data: null };
    }

    const issued: MobileId = { ...sample, vcId: `${sample.vcId}-${Date.now()}` };
    return ok(issued);
  },
};
