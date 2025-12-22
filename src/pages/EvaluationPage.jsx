import { useParams, useSearchParams, useNavigate } from "react-router-dom";

export default function EvaluationPage() {
  const { uuid } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const mode = params.get("mode") ?? "mild"; // mild | spicy

  // TODO: 실제 AI 응답으로 교체
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
        <div
          className="nes-container is-rounded"
          style={{ background: "#fff", marginBottom: 16 }}
        >
          <div className="mini" style={{ padding: 16 }}>
            합성된 트리 이미지 자리
          </div>
        </div>

        {/* 점수 */}
        <h4>총점: {mockResult.score} 점</h4>

        {/* 평가 코멘트 */}
        <div
          className="nes-container is-rounded"
          style={{ background: "#fff" }}
        >
          <p>{mockResult.comment}</p>
        </div>

        {/* 버튼 */}
        <div className="btn-row">
          <button className="nes-btn is-success">이미지 다운로드</button>
          <button className="nes-btn" onClick={() => navigate(`/tree/${uuid}`)}>
            트리로 돌아가기
          </button>
        </div>
      </section>
    </div>
  );
}
