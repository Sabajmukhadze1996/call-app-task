import React from "react";
import UsersTable from "./components/table/Table";

const App = () => {
  return (
    <div className="app-container">
      <div className="app-content-container">
        <div className="app-content">
          <UsersTable />
        </div>
      </div>
    </div>
  );
};

export default App;
