import Hero from "../../component/common/Hero";

const Home = () => {
  return (
    <>
      <Hero />

      {/* Placeholder sections - will fill later */}
      <section className="py-16 text-center text-ternary">
        <h2 className="text-2xl font-bold text-primary">About Our School</h2>
        <p className="max-w-2xl mx-auto mt-4 font-text">
          Kishan Campus Intermediate College is committed to providing quality education
          & empowering rural students through technology & modern learning systems.
        </p>
      </section>

      <div className="bg-white py-20 text-center">
        <h2 className="text-2xl font-bold text-primary">Notices & Announcements</h2>
        <p className="mt-2 text-gray-500">Coming Soon...</p>
      </div>
    </>
  );
};

export default Home;
