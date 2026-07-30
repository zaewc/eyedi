import { VerifyProfile, VerifiablePresentation, VerifyResult, VerifyConst } from '@/types';

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

export const VpvService = {
  async parseVerifierQr(raw: string): Promise<VerifyProfile> {
    await delay(500);

    let trxCode = 'TRX-DEMO-0001';
    try {
      const parsed = JSON.parse(raw);
      trxCode = parsed.trxcode ?? parsed.trxCode ?? trxCode;
    } catch {
      if (raw && raw.length > 0) trxCode = raw.slice(0, 24);
    }
    return {
      trxCode,
      verifier: '카카오뱅크',
      purpose: '비대면 계좌 개설 본인확인',
      mode: VerifyConst.MODE_QR_MPM,
      requestedClaims: [
        { key: 'name', label: '성명', required: true },
        { key: 'birthday', label: '생년월일', required: true },
        { key: 'address', label: '주소', required: true },
        { key: 'photo', label: '사진', required: false },
      ],
    };
  },

  async createPresentationPayload(vp: VerifiablePresentation): Promise<string> {
    await delay(300);
    return JSON.stringify({
      type: 'mobileid-vp',
      ver: VerifyConst.VERSION_200,
      mode: VerifyConst.MODE_QR_CPM,
      trxcode: vp.trxCode,
      vcId: vp.vcId,
      vcType: vp.vcType,

      claims: vp.disclosedClaims,
      iat: vp.createdAt,
    });
  },

  async submitPresentation(vp: VerifiablePresentation, verifier: string): Promise<VerifyResult> {
    await delay(1200);
    return {
      success: true,
      trxCode: vp.trxCode,
      verifier,
      verifiedAt: new Date().toISOString(),
      message: '신원 확인이 완료되었습니다.',
    };
  },
};
