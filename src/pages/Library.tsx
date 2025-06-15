
import React from "react";

const books = [
  { title: "Невыносимая лёгкость бытия", author: "Милан Кундера", description: "Про любовь, внутреннюю свободу и ответственность." },
  { title: "Сила привычки", author: "Чарльз Дахигг", description: "О том, как формируются наши привычки и как ими управлять." },
  { title: "Мастер и Маргарита", author: "Михаил Булгаков", description: "Классика русской литературы, магия и философия." },
  { title: "Чистый код", author: "Роберт Мартин", description: "Книга для разработчика, как писать хороший код." },
];

const Library: React.FC = () => (
  <div style={{padding: "32px 0", maxWidth: 600, margin: "0 auto"}}>
    <h1 style={{textAlign: "center", color:"#4bb6fa", marginBottom:20}}>Библиотека</h1>
    <ul style={{listStyle:"none", padding:0}}>
      {books.map((book, idx) => (
        <li key={idx} style={{
          background: "#232834",
          border: "1.5px solid #313846",
          borderRadius: 9,
          marginBottom: 18,
          padding: "16px 20px"
        }}>
          <div style={{fontWeight:"bold", fontSize:"1.12rem", color:"#e3e7ef"}}>{book.title}</div>
          <div style={{color:"#8891a6", marginBottom:6}}>Автор: {book.author}</div>
          <div style={{fontSize:"1rem"}}>{book.description}</div>
        </li>
      ))}
    </ul>
  </div>
);

export default Library;
