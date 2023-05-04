import React from "react";
import UsersTable from "./components/table/Table";
import {
  BrowserRouter as RouterContainer,
  Routes,
  Route,
} from "react-router-dom";
import Chart from "./components/chart/Chart";

const App = () => {
  return (
    <RouterContainer>
      <div className="app-container">
        <div className="app-content-container">
          <div className="app-content">
            <Routes>
              <Route path="/*" element={<UsersTable />} />
              <Route path="/chart" element={<Chart />} />
            </Routes>
          </div>
        </div>
      </div>
    </RouterContainer>
  );
};

export default App;
