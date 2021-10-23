import React from "react";
import Budget from "./components/Budget";
import budgetDataStore from "./stores";

function App() {
    // this is a hacky way to get around not having routing
    budgetDataStore.preload();

    return (
        <div className="App">
            <Budget />
        </div>
    );
}

export default App;
