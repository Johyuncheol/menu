import "./App.css";
import Menu from "./components/menu/Menu";
import Header from "./components/header/Header";
import Profile from "./components/profile/Profile";

function App() {
  return (
    <div className="App">
      <Header />
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
    </div>
  );
}

export default App;
