import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <section className="nes-container is-rounded panel">
        <h2 style={{ marginTop: 0 }}>내 트리를 꾸며줘!</h2>

        <p className="mini">
          내가 그린 트리 위에, 친구가 그린 장식으로 트리를 완성해보세요
        </p>

        <div className="btn-row">
          <button
            className="nes-btn is-primary"
            onClick={() => navigate("/tree/new")}
          >
            <div>트리 만들기</div>
          </button>
        </div>
      </section>
    </div>
  );
}
