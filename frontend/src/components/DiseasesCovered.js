import React from "react";
import Navbar from "./Navbar";

function DiseasesCovered() {
  const diseases = [
    { name: "Normal", description: "No infection detected in the lungs." },
    {
      name: "Pneumonia",
      description:
        "Infection that inflames air sacs in one or both lungs, which may fill with fluid.",
    },
    {
      name: "COVID-19",
      description:
        "Respiratory illness caused by the coronavirus, can affect lungs and airways.",
    },
    {
      name: "Tuberculosis",
      description: "Serious infectious disease that mainly affects the lungs.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-r from-sky-100 to-blue-200 py-12">
        <div className="container mx-auto px-4">
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-4">Diseases We Cover</h1>
            <p className="text-xl">
              Our AI diagnostics tools are trained to detect a wide range of
              lung diseases, including:
            </p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {diseases.map((disease, index) => (
              <article
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 ease-in-out"
              >
                <h2 className="text-2xl font-semibold text-blue-700 mb-3">
                  {disease.name}
                </h2>
                <p className="text-gray-700">{disease.description}</p>
              </article>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}

export default DiseasesCovered;
