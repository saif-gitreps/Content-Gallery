import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";

/* 
control param is from the react-hook form, it is used to take control of the states of
this component. (Our goal is to reused the editor component for our post form)

the control prop from component param will be passed into this component's controller , basically it will give control to the parent element that calls it.
          
The field is an object that is saying , which ever event is triggered in the the field object, we will re render or render it, here the event is onChange

*/

export default function RTE({ name, control, label, defaultValue = "" }) {
   return (
      <div className="w-full">
         {label ? <label className="inline-block mb-1 pl-1"> {label} </label> : null}
         <Controller
            name={name || "content"}
            control={control}
            render={({ field: { onChange } }) => (
               <Editor
                  initialValue={defaultValue}
                  init={{
                     initialValue: defaultValue,
                     height: 500,
                     menubar: true,
                     plugins: [
                        "image",
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "code",
                        "help",
                        "wordcount",
                        "anchor",
                     ],
                     toolbar:
                        "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                     content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                  onEditorChange={onChange}
               />
            )}
         ></Controller>
      </div>
   );
}
