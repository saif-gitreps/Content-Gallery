const formatDate = (dateString) => {
   const date = new Date(dateString);
   if (isNaN(date.getTime())) {
      // If it's not a valid date, we return the original string
      return dateString;
   }

   const day = date.getDate().toString().padStart(2, "0");
   const month = (date.getMonth() + 1).toString().padStart(2, "0");
   const year = date.getFullYear();

   let hours = date.getHours();
   const minutes = date.getMinutes().toString().padStart(2, "0");
   // const seconds = date.getSeconds().toString().padStart(2, "0");

   const ampm = hours >= 12 ? "PM" : "AM";
   hours = hours % 12;
   hours = hours != "0" ? hours : 12;
   const formattedHours = hours.toString().padStart(2, "0");

   return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
};

export default formatDate;
