export default function getNavItems(authStatus, userData) {
   const items = [
      {
         name: "Home",
         slug: "/",
         active: true,
         forDropDownMenu: false,
      },
      {
         name: "Login",
         slug: "/login",
         active: !authStatus,
         forDropDownMenu: false,
      },
      {
         name: "Signup",
         slug: "/signup",
         active: !authStatus,
         forDropDownMenu: false,
      },
      {
         name: `Profile (${userData?.name})`,
         slug: "/profile",
         active: authStatus,
         forDropDownMenu: true,
      },
      {
         name: "Saved Posts",
         slug: "/saved",
         active: authStatus,
         forDropDownMenu: true,
      },
      {
         name: "My Posts",
         slug: "/my-posts",
         active: authStatus,
         forDropDownMenu: true,
      },
      {
         name: "Add Post",
         slug: "/add-post",
         active: authStatus,
         forDropDownMenu: false,
      },
      {
         name: "Inbox",
         slug: "/inbox",
         active: authStatus,
         forDropDownMenu: false,
      },
   ];
   return items;
}
