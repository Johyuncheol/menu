import "./App.css";
import Menu from "./components/menu/Menu";
import Header from "./components/header/Header";
import Profile from "./components/profile/Profile";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

function App() {
  return (
    <div className="App">
      <Header />

      {/* 사이드바  */}
      <aside className="sidebar">
        <Profile />
        <div className="menuLable">관리자 메뉴</div>
        <div className="adminMenu">
          <Menu />
        </div>
        <div className="menuLable">메뉴</div>
        <div className="Menu">
          <Menu />
        </div>
      </aside>

      {/* 메인  */}
      <section className="main">
        메뉴 추가하기
        <form className="form">
          <label>메뉴 이름</label>
          <input type="text" />

          <label>카테고리</label>
          <select>
            <option>111</option>
            <option>222</option>
          </select>
        </form>
      </section>
    </div>
  );
}

export default App;
