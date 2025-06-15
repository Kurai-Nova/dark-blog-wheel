
import React from "react";
import { useNavigate } from "react-router-dom";
import MainMenu from "../../components/MainMenu/MainMenu";
import "./style.scss";

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="blog-main">
        <MainMenu navigate={navigate} />
        <div>
          <h1>Добро пожаловать в <span style={{color:'#4bb6fa'}}>Nick Notebook</span></h1>
          <p>
            Этот блог — источник лаконичных заметок по любым темам.<br />
            <span style={{color:"#4bb6fa"}}>Навигация — через интерактивное круговое меню в центре.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
