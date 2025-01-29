import Header from "./Header/Header.jsx";
import Navigation from "./Navigation/Navigation.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";
import PaymentRecords from "./Payment-Records/Payment-Records.jsx";
import VerifyPayments from "./Verify-Payments/Verify-Payments.jsx";
import StudentRecords from "./Student-Records/Student-Records.jsx";
import { Route, Routes } from "react-router-dom";

function App() {
  const mainStyle = {
    width: "calc(100% - 275px)",
    margin: "120px 0 0 275px",
  };

    return (
      <>
      <Header />
      <Navigation />
      <main className="main-display" style={mainStyle}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/payment-records" element={<PaymentRecords />} />
          <Route path="/verify-payments" element={<VerifyPayments />} />
          <Route path="/student-records" element={<StudentRecords />} />
        </Routes>
      </main>
      </>
    );
}

export default App
