const asset = "/dongbaek/";

export type GoodsPhoto = { src: string; alt: string; contain?: boolean } | { src: string; alt: string; crop: [number, number, number, number] } | null;
export type GoodsItem = {
  id: string;
  name: string;
  category: "패션" | "소품";
  photo: GoodsPhoto;
  detail?: GoodsPhoto;
  limited?: boolean;
  usage: string;
  story: string;
};

export const goods: GoodsItem[] = [
  {
    id: "oil", name: "동백오일", category: "소품",
    photo: { src: asset + "camellia-oil.png", alt: "동백꽃 라벨이 붙은 오일병과 상자", contain: true },
    detail: { src: asset + "camellia-oil-pasta.png", alt: "고사리 파스타에 동백오일을 두르는 모습" },
    usage: "고사리 오일 파스타를 완성할 때 향을 더하는 한 방울로 사용해 보세요.",
    story: "오일병과 상자에 동백꽃과 민트색 궤도선을 담아, 식탁에서도 마을의 색을 만날 수 있게 했어요.",
  },
  {
    id: "bouquet", name: "동백꽃 풍선 부케", category: "소품",
    photo: { src: asset + "balloon-bouquet.png", alt: "꽃 모양 풍선과 리본, 블룸 유어 웨이 패키지" },
    detail: { src: asset + "balloon-party.png", alt: "야외 식탁 옆에 동백꽃 풍선 부케와 패키지가 놓인 모습" },
    usage: "야외 식탁이나 축하 자리에 놓아 사진에 화사한 포인트를 더해 보세요.",
    story: "핑크 동백꽃과 블루 네잎을 큼직한 풍선으로 바꾸고, 리본으로 한데 묶었어요.",
  },
  {
    id: "grip", name: "그립톡", category: "소품", limited: true,
    photo: { src: asset + "camellia-grip.png", alt: "분홍 동백꽃과 색색의 심볼이 들어간 투명 원형 그립톡", contain: true },
    usage: "휴대전화 뒷면에 붙여 한 손으로 들기 편하게 도와주는 액세서리예요.",
    story: "동백꽃 모양이 눈에 띄도록 투명한 원형 테두리로 감싸는 디자인입니다.",
  },
  {
    id: "keyring", name: "키링", category: "패션",
    photo: { src: asset + "camellia-keyring.png", alt: "금속 고리에 동백꽃과 블루 네잎, 노란 타원 장식이 달린 키링", contain: true },
    usage: "가방 지퍼나 열쇠에 달아 매일 들고 다니는 물건에 작은 포인트를 더해 보세요.",
    story: "동백꽃과 블루 네잎, 노란 타원 장식을 금속 고리에 매달아 걷는 걸음마다 흔들리도록 디자인했어요.",
  },
  {
    id: "stickers", name: "스티커 세트", category: "소품",
    photo: { src: asset + "camellia-stickers.png", alt: "흰 테두리 안에 분홍 동백꽃과 색색의 심볼이 들어간 스티커 세트", contain: true },
    usage: "다이어리나 노트북에 좋아하는 모양을 골라 붙여 나만의 조합을 만들어 보세요.",
    story: "동백꽃, 민트색 궤도선, 손글씨 로고를 각각 떼어 쓸 수 있게 흰 테두리를 둘렀어요.",
  },
];

