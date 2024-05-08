function SaveAndCancelDiv({
   save = null,
   cancel = null,
   type = "submit",
   saveText = "Save",
   cancelText = "Close",
}) {
   return (
      <div className="flex justify-center items-center m-2">
         <button
            type={type}
            className="bg-green-300 p-2 mx-1 rounded-lg hover:cursor-pointer hover:opacity-50"
            onClick={save}
         >
            {saveText}
         </button>
         <button
            className="bg-red-300 p-2 mx-1 rounded-lg hover:cursor-pointer hover:opacity-50"
            onClick={cancel}
         >
            {cancelText}
         </button>
      </div>
   );
}

export default SaveAndCancelDiv;
