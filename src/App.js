import "./App.css";
import Menu from "./components/menu/Menu";
import Header from "./components/header/Header";
function App() {
  return (
    <div className="App">
      <Header />
      <aside className="sidebar">
        <Menu />
      </aside>
    </div>
  );
}

export default App;
