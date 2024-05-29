import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black bg-opacity-75 text-white text-center py-3 w-full">
      <div className="container mx-auto px-4">
        <p className="text-sm md:text-base">
          © {currentYear} All rights reserved. Developed by
          <a
            href="https://www.linkedin.com/in/biniyamgashaw/"
            className="text-blue-300 hover:text-blue-500 transition duration-300 inline-block ml-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Biniyam Gashaw
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
