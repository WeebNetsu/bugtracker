import { render } from "preact";
import { Slide, toast, ToastContainer } from "react-toastify";
import { useLocation } from "wouter";
import SiteRouter from "./components/SiteRouter";
import { Button } from "./components/ui/button";
import "./style.css";

export function App() {
    const [location, navigate] = useLocation();

    return (
        <div>
            <h1 className={"text-3xl font-bold"}>Bug Tracker</h1>

            <Button onClick={() => toast.error("Error here")}>Error</Button>

            <SiteRouter />

            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                limit={3}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Slide}
            />
        </div>
    );
}

render(<App />, document.getElementById("app"));
