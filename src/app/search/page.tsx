"use client";

import Link from "next/link";
import HeaderSearchViewMode from "@/components/search/HeaderSearchViewMode";
import ContentSearch from "@/components/search/ContentSearch";
import { PaginationBar } from "@/components/search/ui/PaginationBar";
import { Suspense } from "react";
import Loading from "@/components/common/loading/loading";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] font-sans text-gray-900 flex flex-col justify-between items-start">
      {/* Mock nav bar in Component */}
      <Navbar />

      <Suspense fallback={<Loading/>}>
        <div className="w-full max-w-[1440px] self-center flex flex-col gap-6">
          <HeaderSearchViewMode />
          <ContentSearch />
        </div>
      </Suspense>
      <PaginationBar />
      {/* Mock up footer in Component */}
      <Footer />
    </div>
  );
}

{
  /* Mock nav bar in Component */
}
const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between px-[92px] py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-1">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 flex items-center"
        >
          Mockup Sitter
          <span className="text-green-500 text-3xl leading-none">*</span>
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4"></div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full transition shadow-md">
          Find A Pet Sitter
        </button>
      </div>
    </nav>
  );
};

{
  /* Mock up footer in Component */
}
const Footer = () => {
  return (
    <footer className="bg-black text-white py-16 mt-20 w-full h-70">
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-center items-center gap-1 mb-4">
          <span className="text-4xl font-bold flex items-center text-orange-500">
            Mockup Sitter
            <span className="text-green-500 text-5xl leading-none">*</span>
          </span>
        </div>
        <p className="text-gray-400 text-lg font-medium">
          Find your perfect pet sitter with us.
        </p>
      </div>
    </footer>
  );
};
