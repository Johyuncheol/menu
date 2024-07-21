import "./App.css";
import Header from "./components/header/Header";
import Aside from "./components/aside/Aside";
import AddForm from "./components/addForm/AddForm";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMenuAPI } from "./api/menu";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuData, setMenuData] = useState({});

  const fetchData = async () => {
    if (!location.pathname) return;
    const res = await fetchMenuAPI(location.pathname);
    if (res) {
      setMenuData(res);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("ad");
      console.log(location.pathname)
    }
  }, [location.pathname, navigate]);

  return (
    <div className="App">
      <Header />
      <div className="App-body">
        <Aside data={menuData} path={location.pathname} fetchData={fetchData}/>
        <main className="App-main">
          <AddForm path={location.pathname} fetchData={fetchData}/>
        </main>
      </div>
    </div>
  );
}

export default App;
