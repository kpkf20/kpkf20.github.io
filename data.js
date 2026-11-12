/* =========================================================
   대한민국 직업강사 파크골프연맹 홈페이지 데이터
   보도자료·지사 정보를 바꿀 때는 이 파일만 수정해서 올리면 됩니다.
   ========================================================= */

/* 신청서·취소서·조회 요청을 받을 이메일 */
const APPLY_EMAIL = "a01075283582@gmail.com";

/* 보도자료: 최신 기사를 맨 위에 추가하세요. { 제목, 주소, 날짜 } */
const PRESS = [
  { title: "(사)대한민국 파크골프 연맹 김건우 총괄본부장, 우천 속에서도 심판 현장실습 교육 진행", url: "https://www.skypress.co.kr/news/articleView.html?idxno=153716", date: "2026.11.02" },
  { title: "(사)대한민국파워지식교육협회–가수인생활 엔터테인먼트, 상생 발전 위한 업무협약 체결", url: "https://www.skypress.co.kr/news/articleView.html?idxno=153715", date: "2026.11.02" },
  { title: "(사)대한민국 파크골프 연맹, 파크골프 지도자·심판 1급 자격증반 교육", url: "https://www.skypress.co.kr/news/articleView.html?idxno=153713", date: "2026.11.02" },
  { title: "대한민국 파크골프연맹, 김태희 경남본부장 임명", url: "https://www.skypress.co.kr/news/articleView.html?idxno=151344", date: "2026.10.27" },
  { title: "대한민국파워지식교육협회-대한민국 파크골프 연맹, 현장 중심 파크골프 전문인력 양성에 박차", url: "https://www.skypress.co.kr/news/articleView.html?idxno=150812", date: "2026.10.26" },
  { title: "대한민국파워지식교육협회-대한민국 파크골프 연맹, 김건우 전국 총괄본부장 임명", url: "https://www.skypress.co.kr/news/articleView.html?idxno=150811", date: "2026.10.26" },
  { title: "대한민국 파크골프 연맹, 교육생 대상 교육 진행", url: "https://www.skypress.co.kr/news/articleView.html?idxno=137961", date: "2026.09.15" },
  { title: "대한민국파워지식교육협회, 파크골프 전남지사 출범", url: "https://www.skypress.co.kr/news/articleView.html?idxno=118944", date: "2026.07.21" },
  { title: "대한민국파워지식교육협회, 파크골프 대구경북지사 출범", url: "https://www.skypress.co.kr/news/articleList.html?sc_area=A&view_type=sm&sc_word=%ED%8C%8C%EC%9B%8C%EC%A7%80%EC%8B%9D%EA%B5%90%EC%9C%A1%ED%98%91%ED%9A%8C", date: "" }
];
const PRESS_SOURCE = "대한뉴스방송";

/* 전국지사 데이터: [지사명, 지사장, 주소, 연락처, 지도 검색어, 정확한 주소 여부] */
const BRANCHES = {
  "전국": [["전국 총괄본부","김건우 총괄본부장","추후 안내","010-7528-3582","",false]],
  "서울": [["서울 본사","백옥례 총회장","서울시 서초구 반포대로28길 76-10","010-2244-8697","서울특별시 서초구 반포대로28길 76-10",true]],
  "대구": [["대구지사","김병희 지사장","추후 안내","010-5264-1467","대구광역시",false],["통합 수성지사","이도영 지사장","추후 안내","010-3012-3331","대구광역시 수성구",false]],
  "경북": [["경북지사","서혜언 지사장","추후 안내","010-3601-9015","경상북도",false],["구미지사","안장환 지사장","추후 안내","010-5077-3739","경상북도 구미시",false]],
  "경남": [["경남본부","김태희 본부장","추후 안내","010-6703-7091","경상남도",false]],
  "전남": [["전남지사 (순천·호남거점)","유훈진 지사장","추후 안내","010-2381-7727","전라남도 순천시",false]]
};

/* 자격증 조회: 취득자 명단(암호화된 값). 명단 추가는 담당자에게 요청하세요. */
const CERT_SALT = "KPKF-2026";
const CERT_HOLDERS = {
};
