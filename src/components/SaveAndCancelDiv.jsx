import { Button } from "../components";

function SaveAndCancelDiv({
   save = null,
   cancel = null,
   type = "submit",
   saveText = "Save",
   cancelText = "Close",
}) {
   return (
      <div className="flex justify-center items-center m-2">
         <Button
            text={saveText}
            type={type}
            onClick={save}
            className="text-sm h-11"
            bgNumber={0}
         />
         <Button
            text={cancelText}
            type={type}
            onClick={cancel}
            className="text-sm h-11"
            bgNumber={2}
         />
      </div>
   );
}

export default SaveAndCancelDiv;
