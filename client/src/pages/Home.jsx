import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import Features from "./Features";
import ProblemsPage from "./ProblemsPage";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#030407] text-white">
      <Navbar />

      <main>
        <Hero />
        <Features/>
        <ProblemsPage/>
      </main>
    </div>
  );
};

export default Home;
