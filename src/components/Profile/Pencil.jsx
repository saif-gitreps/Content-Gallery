function Pencil({ className = "", onClickAction = null }) {
   return (
      <img
         src="edit-icon.png"
         alt="Pencil"
         className={`dark:invert w-4 h-4 hover:cursor-pointer hover:opacity-50 ${className}`}
         onClick={onClickAction}
      />
   );
}

export default Pencil;
