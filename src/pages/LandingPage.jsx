import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <section className="nes-container is-rounded panel">
        <h2 style={{ marginTop: 0 }}>내 트리를 꾸며줘! 🎄</h2>

        <p className="mini">
          내가 트리를 그리고, 친구들이 장식을 올려 함께 완성하는 크리스마스 이벤트.
        </p>

        <div className="btn-row">
          <button
            className="nes-btn is-primary"
            onClick={() => navigate("/tree/new")}
          >
            트리 만들기
          </button>
        </div>
      </section>
    </div>
  );
}
