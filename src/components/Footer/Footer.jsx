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
            </div>
         </Container>
      </section>
   );
}

export default Footer;
