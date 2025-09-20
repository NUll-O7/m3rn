import React from "react";
import {PlusIcon} from 'lucide-react'
import { Link } from "react-router-dom";

const Navbar = () => { 
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">NoteMaster</h1>
          <div className="flex items-center gap-5">
            <Link to={"/create"} className="btn btn-primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              New Note
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;  