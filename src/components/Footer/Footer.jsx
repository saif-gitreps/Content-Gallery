import { Link } from "react-router-dom";
import { Logo, Container } from "../../components";

function Footer() {
   return (
      <section className="relative overflow-hidden py-2 bg-white border border-t-2 border-t-black">
         <Container>
            <div className="m-3 flex flex-wrap">
               <div className="w-full p-3 md:w-1/2">
                  <div className="flex h-full flex-col justify-between">
                     <div className="mb-4 inline-flex items-center">
                        <Logo className="w-20" />
                     </div>
                     <div>
                        <p className="text-sm text-gray-600">&copy; Copyright 1928.</p>
                     </div>
                  </div>
               </div>

               <div className="w-full p-3  md:w-1/2 flex flex-col justify-end items-end">
                  <div className="h-full">
                     <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-gray-500">
                        Legals
                     </h3>
                     <ul className="">
                        <li className="mb-4">
                           <Link
                              className=" text-base font-medium text-gray-900 hover:text-gray-700"
                              to="/"
                           >
                              Terms &amp; Conditions
                           </Link>
                        </li>
                        <li className="mb-4">
                           <Link
                              className=" text-base font-medium text-gray-900 hover:text-gray-700"
                              to="/"
                           >
                              Privacy Policy
                           </Link>
                        </li>
                        <li>
                           <Link
                              className=" text-base font-medium text-gray-900 hover:text-gray-700"
                              to="/"
                           >
                              Licensing
                           </Link>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
         </Container>
      </section>
   );
}

export default Footer;
