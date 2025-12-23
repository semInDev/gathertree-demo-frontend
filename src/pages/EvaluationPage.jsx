import {
  useParams,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EvaluationPage() {
  const { uuid } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const mode = params.get("mode") ?? "mild"; // mild | spicy

  // 이전 페이지에서 보낸 최종 트리
  const finalImageUrl = location.state?.finalImageUrl;
  const [treeData, setTreeData] = useState(null);

  //트리 정보 필요한 경우에만 호출 (필요할까??)
  useEffect(() => {
    axios.get(`https://api.beour.store/tree/${uuid}`).then((res) => {
      if (res.data.isSuccess) {
        setTreeData(res.data.data);
      }
    });
  }, [uuid]);

  // TODO: 실제 AI 응답으로 교체 (백엔드 연동 시 삭제)
  const mockResult = {
    score: 83,
    title: "정성 가득한 크리스마스 트리",
    comment:
      mode === "mild"
        ? "따뜻한 마음이 느껴지는 트리예요. 장식 하나하나에 정성이 담겨 있어요."
        : "이 정도면 트리라기보단 장식 전시장입니다. 과하지만… 인정.",
  };

  return (
    <div className="app-shell">
      <section className="nes-container is-rounded panel">
        <h3 style={{ marginTop: 0 }}>
          평가 결과 ({mode === "mild" ? "순한맛" : "매운맛"})
        </h3>

        {/* 트리 이미지 */}
        {treeData ? (
          <div
            className="nes-container is-rounded"
            style={{ background: "#fff", marginBottom: 16 }}
          >
            {finalImageUrl ? (
              <img
                src={finalImageUrl}
                alt="완성된 최종 트리"
                style={{ width: "100%", imageRendering: "pixelated" }}
              />
            ) : (
              <div style={{ padding: 20 }}>
                최종 이미지를 생성 중이거나 찾을 수 없습니다.
              </div>
            )}
          </div>
        ) : (
          <div
            className="nes-container is-rounded mini"
            style={{ background: "#fff", marginBottom: 16, padding: 16 }}
          >
            트리 불러오는 중...
          </div>
        )}

        {/* 점수 */}
        <h4 style={{ marginTop: "2rem", marginBottom: "1.3rem" }}>
          총점: {mockResult.score} 점
        </h4>

        {/* 평가 코멘트 */}
        <div
          className="nes-container is-rounded"
          style={{ background: "#fff" }}
        >
          <p>{mockResult.comment}</p>
        </div>

        {/* 버튼 */}
        <div
          className="btn-row"
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button className="nes-btn" onClick={() => navigate(`/tree/${uuid}`)}>
            트리로 돌아가기
          </button>
        </div>
      </section>
    </div>
  );
}
