
import React from "react";
import { useNavigate } from "react-router-dom";
import MainMenu from "../../components/MainMenu/MainMenu";
import "./style.scss";

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <MainMenu navigate={navigate} />
      <div>
        <h1>Добро пожаловать в <span style={{color:'#4bb6fa'}}>Notebook</span></h1>
        <p>
          Это простой блог на React, который может использовать Markdown в качестве формата хранения данных.<br />
          <span style={{color:"#4bb6fa"}}>Навигация — через интерактивное круговое меню в центре.</span>
        </p>
      </div>
    </div>
  );
};

export default Index;
