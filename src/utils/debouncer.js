/*
Debouncing is a technique used to ensure that a function is not called too frequently. Instead of allowing the function to be executed every time an event is triggered (which could be many times in rapid succession), debouncing ensures that the function is called only once after a specified amount of time has passed since the last event.

Initial Call: When the event is triggered, a timer is set to delay the function execution.
Subsequent Calls: If the event is triggered again before the timer expires, the timer is reset.
Final Call: The function is executed only after the timer expires without being reset by a new event.

Scroll events can fire rapidly, potentially calling the event handler many times in quick succession. This can lead to performance issues, especially if the handler involves expensive operations like making API calls or updating the DOM.
*/

const debounce = (fn, delay) => {
   let timeoutId;
   return (...args) => {
      if (timeoutId) {
         clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
         fn(...args);
      }, delay);
   };
};

export default debounce;
