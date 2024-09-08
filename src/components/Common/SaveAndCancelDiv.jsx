import { Button } from "..";

function SaveAndCancelDiv({
   save = null,
   cancel = null,
   type = "submit",
   saveText = "Save",
   cancelText = "Close",
}) {
   return (
      <div className="flex justify-start items-center my-2 space-x-1">
         <Button
            text={saveText}
            type={type}
            onClick={save}
            className="text-sm h-10"
            bgNumber={0}
         />
         <Button
            text={cancelText}
            type={type}
            onClick={cancel}
            className="text-sm h-10"
            bgNumber={2}
         />
      </div>
   );
}

export default SaveAndCancelDiv;
