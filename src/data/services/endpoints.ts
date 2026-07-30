export const HOSTS = {
  MIA: 'https://mia.mobileid.go.kr',
  CAG: 'https://cag.mobileid.go.kr',
  PUB: 'https://pub.mobileid.go.kr',
  BCG: 'https://bcg.mobileid.go.kr',
  BCC: 'https://bcc.mobileid.go.kr',
  EXS: 'https://exs.mobileid.go.kr',
  WWW: 'https://www.mobileid.go.kr',
} as const;

export const WEB_URLS = {
  notice: `${HOSTS.WWW}/mip/webview/selectWebNoticeNew.do`,
  pushList: `${HOSTS.WWW}/mip/webview/webPushListNew.do`,
  useGuidance: `${HOSTS.WWW}/mip/webview/webUseGuidance.do`,
  license: `${HOSTS.WWW}/mip/webview/getAOSLicense.do`,
  serviceCenter: `${HOSTS.WWW}/mip/hps/svcCnter/indexSvcCnter.do`,
} as const;
