
import React from "react";
import { useNavigate } from "react-router-dom";

import MainMenu from "../components/MainMenu/MainMenu";

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="blog-main">
        <MainMenu navigate={navigate} />
        <div style={{textAlign:"center", margin:"56px 0 0 0"}}>
          <h1 style={{marginBottom: 13}}>Добро пожаловать в <span style={{color:'#4bb6fa'}}>Nick Notebook</span></h1>
          <p style={{maxWidth:560, margin:"0 auto", color:"#8891a6", fontSize: "1.18rem"}}>
            Этот блог — источник лаконичных заметок по любым темам.<br />
            <span style={{color:"#4bb6fa"}}>Навигация — через интерактивное круговое меню в центре.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
