import "./App.scss"

import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navigator from "./components/Navigator";
import Footer from "./components/Footer";
import Settings from "./pages/Settings";
import Receive from "./pages/Receive";
import Send from "./pages/Send";
import SettingsProvider from "./contexts/Settings/SettingsProvider.tsx";
import ReceiveProvider from "./contexts/Receive/ReceiveProvider.tsx";
import SendProvider from "./contexts/Send/SendProvider.tsx";
import Macros from "./pages/Macros";
import MacrosProvider from "./contexts/Macros/MacrosProvider.tsx";

function App() {
    return (
        <Router>
            <SettingsProvider>
                <ReceiveProvider>
                    <SendProvider>
                        <MacrosProvider>

                            <Navigator/>
                            <Routes>
                                <Route path="/" element={<Settings/>}/>
                                <Route path="/receive" element={<Receive/>}/>
                                <Route path="/send" element={<Send/>}/>
                                <Route path="/macros" element={<Macros/>}/>
                            </Routes>
                            <Footer/>

                        </MacrosProvider>
                    </SendProvider>
                </ReceiveProvider>
            </SettingsProvider>
        </Router>
    );
}

export default App;