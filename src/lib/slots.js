// 160x192 트리 위에 32x32 장식 10개를 배치하는 고정 슬롯
// 1 / 2 / 3 / 4 형태로 센터 정렬된 좌표
export const TREE_W = 160;
export const TREE_H = 192;
export const DECO = 32;

export function getSlots() {
  // x는 센터 정렬 공식으로 배치
  const centerX = (TREE_W - DECO) / 2; // 64

  // 각 줄의 y(위에서 아래로) — 트리가 세로로 긴 느낌
  const y1 = 22;
  const y2 = 58;
  const y3 = 95;
  const y4 = 132;

  // 줄 간 간격(장식 간격)
  const gap = 10;

  const row1 = [{ x: centerX, y: y1 }];

  const row2 = [
    { x: centerX - (DECO + gap) / 2, y: y2 }, // 왼
    { x: centerX + (DECO + gap) / 2, y: y2 }, // 오
  ];

  const row3 = [
    { x: centerX - (DECO + gap), y: y3 },
    { x: centerX, y: y3 },
    { x: centerX + (DECO + gap), y: y3 },
  ];

  const row4 = [
    { x: centerX - (DECO + gap) * 1.5, y: y4 },
    { x: centerX - (DECO + gap) * 0.5, y: y4 },
    { x: centerX + (DECO + gap) * 0.5, y: y4 },
    { x: centerX + (DECO + gap) * 1.5, y: y4 },
  ];

  // 총 10개
  return [...row1, ...row2, ...row3, ...row4].map((p) => ({
    x: Math.round(p.x),
    y: Math.round(p.y),
  }));
}
