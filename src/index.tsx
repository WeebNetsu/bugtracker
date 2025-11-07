import { render } from "preact";

import "./style.css";

export function App() {
    return (
        <div>
            <h1 className={"text-3xl font-bold"}>Bug Tracker</h1>
        </div>
    );
}

render(<App />, document.getElementById("app"));
