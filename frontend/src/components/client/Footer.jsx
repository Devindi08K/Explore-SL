import React from "react";

const Footer = () => {
  return (
    <footer className="bg-tan text-cream py-4 mt-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Explore Sri Lanka. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
