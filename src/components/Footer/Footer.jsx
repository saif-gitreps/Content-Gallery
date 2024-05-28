import { Logo } from "../../components";

function Footer() {
   return (
      <footer className="bg-white shadow-2xl h-36 flex items-center">
         <div className="ml-10">
            <div className="mb-4 inline-flex items-center">
               <Logo className="w-20" />
            </div>
            <div>
               <p className="text-sm text-gray-600">&copy; Copyright 1928.</p>
            </div>
         </div>
      </footer>
   );
}

export default Footer;
