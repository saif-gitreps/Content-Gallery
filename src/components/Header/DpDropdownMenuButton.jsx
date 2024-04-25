function DpDropdownMenuButton({ src }) {
   return (
      <div className="flex row px-2 py-2 rounded-xl duration-300 hover:shadow-md hover:cursor-pointer">
         <img src={src} alt="profile" className="w-12 h-12 rounded-2xl" />
         <p className="flex items-center">▼</p>
      </div>
   );
}

export default DpDropdownMenuButton;
