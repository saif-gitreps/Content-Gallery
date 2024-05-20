import { useForm } from "react-hook-form";

function CommentForm({ onSubmit }) {
   const { register, handleSubmit } = useForm({
      defaultValues: { content: "" },
   });

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <textarea
            {...register("content", { required: true })}
            className="w-full h-24 p-4 mt-4 border rounded-xl"
            placeholder="Add a comment"
         ></textarea>
         <button
            type="submit"
            className="w-full py-3 bg-blue-400 duration-300 hover:shadow-md hover:bg-blue-100 rounded-lg mt-4"
         >
            Add Comment
         </button>
      </form>
   );
}

export default CommentForm;
