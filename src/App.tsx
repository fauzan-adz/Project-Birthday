import Section1 from "./components/section/Section1";
import Section2 from "./components/section/Section2";
import Section3 from "./components/section/Section3";
import Section4 from "./components/section/Section4";
import "./App.css";

function App() {
  
  return (
    // Membungkus seluruh konten dengan overflow-x-hidden untuk mencegah scroll horizontal
    <div className="overflow-x-hidden">
      <Section1 />
      <Section3 />
      <Section4 />
      <Section2 />
    </div>
  );
}

export default App;
