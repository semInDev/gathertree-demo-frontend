import {
  useParams,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas"; // 캡처를 위한 라이브러리 사용

export default function EvaluationPage() {
  const { uuid } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const mode = params.get("mode") ?? "mild"; // mild | spicy
  const imageKey = location.state?.imageKey;
  const previewUrl = location.state?.previewUrl;

  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);

  const printRef = useRef(null);

  useEffect(() => {
    if (!imageKey) {
      alert("이미지 정보가 없습니다. 다시 시도해주세요.");
      navigate(`/tree/${uuid}`);
      return;
    }

    const fetchEvaluation = async () => {
      try {
        setLoading(true);

        const requestBody = {
          imageKey: imageKey,
        };

        const response = await axios.post(
          `https://api.beour.store/tree/${uuid}/evaluate?mode=${mode}`,
          requestBody
        );

        // 선착순 안에 못들어가면 ai 닫혀요 ~
        if (response.data.isSuccess) {
          setEvaluation(response.data.data);
        } else {
          alert(
            "AI 평가 참여가 마감되었습니다. 트리를 함께 만들어주셔서 감사합니다."
          );
          navigate(`/tree/${uuid}`);
        }
      } catch (err) {
        alert(
          "AI 평가 참여가 마감되었습니다. 트리를 함께 만들어주셔서 감사합니다."
        );
        navigate(`/tree/${uuid}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [uuid, mode, imageKey, navigate]);

  // 이미지 저장 함수
  const handleDownloadImage = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      // 캔버스로 변환 (모바일 대응을 위해 scale을 높여 고화질로 캡처)
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true, // 외부 이미지 로드 허용
        backgroundColor: "#e7e7e7", // 배경색 (app-shell 배경색과 맞추기)
        logging: false,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById("capture-area");
          if (el) el.style.display = "block";
        },
      });

      const data = canvas.toDataURL("image/png");
      const link = document.createElement("a");

      link.href = data;
      link.download = `tree-evaluation-${uuid}.png`;
      link.click();
    } catch (error) {
      console.error("이미지 저장 실패:", error);
      alert("이미지 저장 중 오류가 발생했습니다.");
    }
  };

  // 로딩 중 화면
  if (loading) {
    return (
      <div className="app-shell">
        <section className="nes-container is-rounded panel">
          <p className="nes-text is-dark">AI가 트리를 분석하고 있습니다...</p>
          <p>잠시만 기다려주세요! (약 5~10초 소요)</p>
          <progress
            className="nes-progress is-dark"
            value="50"
            max="100"
          ></progress>
        </section>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div>
        <section className="nes-container is-rounded panel">
          <h2 style={{ marginTop: 0, marginBottom: "2rem" }}>
            {evaluation?.title ||
              `평가 결과 (${mode === "mild" ? "순한맛" : "매운맛"})`}
          </h2>

          {/* 트리 이미지 */}
          <div
            className="nes-container is-rounded"
            style={{ background: "#fff" }}
          >
            <img
              src={evaluation?.imageUrl || previewUrl}
              alt="최종 트리"
              style={{ width: "100%", imageRendering: "pixelated" }}
            />
          </div>

          {/* 점수 */}
          <h3 style={{ marginTop: "2rem", marginBottom: "1.3rem" }}>
            총점: <span className="nes-text is-error">{evaluation?.score}</span>{" "}
            점
          </h3>
          {/* 요약 */}
          <div
            className="nes-container is-rounded"
            style={{ background: "#fff", marginBottom: "1.5rem" }}
          >
            <p style={{ fontWeight: "bold" }}>AI 한줄평</p>
            <p>{evaluation?.summary}</p>
          </div>

          {/* 상세 코멘트 리스트 */}
          <div
            className="nes-container with-title is-rounded"
            style={{ background: "#fff", textAlign: "left" }}
          >
            <p className="title" style={{ fontWeight: 700 }}>
              상세 분석
            </p>
            <ul className="nes-list is-disc" style={{ paddingLeft: "20px" }}>
              {evaluation?.comments?.map((comment, idx) => (
                <li
                  key={idx}
                  style={{ marginBottom: "8px", fontSize: "0.9rem" }}
                >
                  {comment}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* 숨겨진 캡처 전용 영역(인스타그램 최적화) */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div
          ref={printRef}
          id="capture-area"
          style={{
            width: "360px", // 전형적인 모바일 캡처 너비
            backgroundColor: "#fff",
            padding: "10px",
          }}
        >
          <div
            className="nes-container is-rounded"
            style={{ backgroundColor: "#fffcf6", padding: "15px" }}
          >
            <h2
              style={{
                fontSize: "1.1rem",
                textAlign: "center",
                marginBottom: "15px",
              }}
            >
              {evaluation?.title}
            </h2>

            {/* 트리 이미지를 작게 줄임 (한 화면에 다 들어오도록) */}
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <img
                src={evaluation?.imageUrl || previewUrl}
                crossOrigin="anonymous"
                style={{
                  height: "140px",
                  width: "auto",
                  imageRendering: "pixelated",
                }}
              />
            </div>

            <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
                총점:{" "}
              </span>
              <span
                className="nes-text is-error"
                style={{ fontSize: "1.1rem" }}
              >
                {evaluation?.score}
              </span>
              <span style={{ fontSize: "1rem" }}> 점</span>
            </div>

            <div
              className="nes-container is-rounded"
              style={{
                padding: "8px",
                marginBottom: "15px",
                background: "#fff",
              }}
            >
              <p style={{ fontSize: "0.75rem", margin: 0, lineHeight: "1.2" }}>
                {evaluation?.summary}
              </p>
            </div>

            <div style={{ textAlign: "left" }}>
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                [상세 분석]
              </p>
              <ul style={{ paddingLeft: "15px", margin: 0 }}>
                {evaluation?.comments?.slice(0, 5).map((comment, idx) => (
                  <li
                    key={idx}
                    style={{ fontSize: "0.65rem", marginBottom: "3px" }}
                  >
                    {comment}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div
        className="btn-row"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          paddingLeft: "1rem",
        }}
      >
        <button
          className="nes-btn"
          onClick={() => navigate(`/tree/${uuid}`)}
          style={{ fontWeight: 700 }}
        >
          트리로 돌아가기
        </button>

        <button
          className="nes-btn is-primary"
          onClick={handleDownloadImage}
          style={{ fontWeight: 700 }}
        >
          결과 이미지 저장하기
        </button>
      </div>
    </div>
  );
}
