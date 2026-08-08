import { VerifyProfile, VerifiablePresentation, VerifyResult, VerifyConst } from '@/types';

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

// mock용 결정적 hex 문자열 (실제 nonce/서명/암호문 자리 채움)
function hex(seed: string, len: number): string {
  const chars = '0123456789abcdef';
  let h = 2166136261;
  let out = '';
  for (let i = 0; i < len; i++) {
    h = (h ^ seed.charCodeAt((i * 7 + 3) % seed.length)) >>> 0;
    h = (h * 16777619) >>> 0;
    out += chars[(h ^ (i * 131)) & 0xf];
  }
  return out;
}

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

  // v1 실제 프로토콜 구조(MsgVp + VP + Credential + Signature)를 모사.
  // 서명/암호화 data 는 mock 이며, 자체 데모 스캔용 값은 _mock 로 분리 표기.
  async createPresentationPayload(vp: VerifiablePresentation): Promise<string> {
    await delay(300);
    const claims = vp.disclosedClaims;
    const privacyList = Object.keys(claims).filter((k) => k !== 'verified' && k !== 'issuer');
    const holderDid = `did:kr:mobileid:${hex(vp.vcId + vp.vcType, 24)}`;
    const nonce = hex(vp.trxCode + Date.now(), 32);

    return JSON.stringify({
      msg: VerifyConst.MSG_VP, // "vp"
      version: VerifyConst.VERSION_200, // "2.0.0"
      mode: VerifyConst.MODE_QR_CPM, // "cpm"
      trxcode: vp.trxCode,
      timezone: 'Asia/Seoul',
      vp: {
        type: 'https://www.w3.org/2018/credentials/v1',
        did: holderDid,
        presentType: VerifyConst.PRESENT_DID_VP, // 1
        encryptType: 1,
        keyType: 1,
        nonce,
        zkpNonce: '',
        authType: ['pin'],
        timezone: 'Asia/Seoul',
        // 실제로는 암호화된 VC(base64) — 여기서는 mock 해시
        data: hex(nonce + vp.vcId, 64),
        credential: {
          id: vp.vcId,
          parentId: '',
          assertion: { code: `assert-${vp.vcType}` },
          privacyList,
        },
      },
      proof: {
        type: 'Secp256r1Signature2018',
        created: vp.createdAt,
        verificationMethod: `${holderDid}#keyagree`,
        proofValue: `MOCK.${hex(nonce + vp.vcType, 40)}`, // ⚠️ mock 서명
      },
      // ⚠️ 데모 전용(실제 프로토콜엔 없음): 자체 스캔 시 표시할 평문 값
      _mock: { claims },
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
