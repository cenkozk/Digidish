import { useEffect, useRef, useState } from "react";
import { supabase } from "../Supabase";
import { useNavigate } from "react-router-dom";
import Sidebar from "react-sidebar";
import BusinessInfo from "../components/BusinessInfo";
import { motion } from "framer-motion";
import CreateMenu from "../components/CreateMenu";
import Steps from "./Steps";
import CheckUser from "./CheckUser";
import { nanoid } from "nanoid";
import CreateMenuDashboard from "./CreateMenuDashboard";
import HomeDashboard from "./HomeDashboard";
import QRLinks from "./QRLinks";
import Plans from "./Plans";

function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState({});
  const [user, setUser] = useState({
    user_metadata: {
      avatar_url: "",
      email: "",
      email_verified: null,
      full_name: "",
      iss: "",
      name: "",
      picture: "",
      provider_id: "",
      sub: "",
    },
  });
  const [restaurantId, setRestaurantId] = useState(null);
  const [paidPlan, setPaidPlan] = useState(null);
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => {
    async function session() {
      const { data, error } = await supabase.auth.getSession();
      if (data.session == null) {
        navigate("/login");
      } else {
        setSession(data);
        setUser(data.session.user);
      }
    }
    session();
  }, []);

  const [isAbove800px, setIsAbove800px] = useState(window.innerWidth > 800);

  // Add event listener to update the state when the window is resized
  useEffect(() => {
    const handleResize = () => {
      setIsAbove800px(window.innerWidth > 800);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        // Handle sign-out error
        console.error("Error while signing out:", error);
      } else {
        // Sign-out successful
        console.log("User signed out successfully.");
        // You can redirect the user to the login page or perform any other actions after sign-out
        navigate("/login");
      }
    } catch (error) {
      console.error("Error while signing out:", error);
    }
  };

  //////////////////////////////////////////////////////////////////////

  const [selectedRoute, setSelectedRoute] = useState("home"); // Set default route here
  console.log(selectedRoute);
  // Other state variables and functions related to your app

  const handleNavigationClick = (route) => {
    setSelectedRoute(route);
  };

  const navigation = [
    {
      route: "home",
      name: "Home",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={0.01}
          className="w-5 h-5 fill-current"
        >
          <path d="M5 22h14a2 2 0 002-2v-9a1 1 0 00-.29-.71l-8-8a1 1 0 00-1.41 0l-8 8A1 1 0 003 11v9a2 2 0 002 2zm5-2v-5h4v5zm-5-8.59l7-7 7 7V20h-3v-5a2 2 0 00-2-2h-4a2 2 0 00-2 2v5H5z" />
        </svg>
      ),
    },
    {
      route: "menu_edit",
      name: "Menu Preview",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
          />
        </svg>
      ),
    },
    {
      route: "menu_edit",
      name: "Edit Your Menu",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z"
          />
        </svg>
      ),
    },
    {
      route: "qr_links",
      name: "QR and Links",
      icon: (
        <svg
          fill="currentColor"
          className="ml-0.5 mr-1"
          viewBox="0 0 16 16"
          height="1em"
          width="1em"
        >
          <path d="M0 .5A.5.5 0 01.5 0h3a.5.5 0 010 1H1v2.5a.5.5 0 01-1 0v-3zm12 0a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v3a.5.5 0 01-1 0V1h-2.5a.5.5 0 01-.5-.5zM.5 12a.5.5 0 01.5.5V15h2.5a.5.5 0 010 1h-3a.5.5 0 01-.5-.5v-3a.5.5 0 01.5-.5zm15 0a.5.5 0 01.5.5v3a.5.5 0 01-.5.5h-3a.5.5 0 010-1H15v-2.5a.5.5 0 01.5-.5zM4 4h1v1H4V4z" />
          <path d="M7 2H2v5h5V2zM3 3h3v3H3V3zm2 8H4v1h1v-1z" />
          <path d="M7 9H2v5h5V9zm-4 1h3v3H3v-3zm8-6h1v1h-1V4z" />
          <path d="M9 2h5v5H9V2zm1 1v3h3V3h-3zM8 8v2h1v1H8v1h2v-2h1v2h1v-1h2v-1h-3V8H8zm2 2H9V9h1v1zm4 2h-1v1h-2v1h3v-2zm-4 2v-1H8v1h2z" />
          <path d="M12 9h2V8h-2v1z" />
        </svg>
      ),
    },
    {
      route: "plans",
      name: "Plans",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
          />
        </svg>
      ),
    },
  ];

  const navsFooter = [
    {
      href: "javascript:void(0)",
      name: "Help",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
          />
        </svg>
      ),
    },
    {
      href: "javascript:void(0)",
      name: "Settings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      name: "Logout",
      clickHandler: handleLogout,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
          />
        </svg>
      ),
    },
  ];

  return (
    <Sidebar
      sidebar={
        <>
          <nav className="top-0 left-0 w-auto h-full border-r bg-white space-y-8 sm:w-80">
            <div class="flex flex-col h-full">
              <div className="h-20 flex items-center px-8">
                <button
                  onClick={() => {
                    setSelectedRoute("home");
                  }}
                  className="flex ml-[-5px] mt-2"
                >
                  <img
                    src="https://res.cloudinary.com/dewy2csvc/image/upload/v1689628008/DigiText_zfdjoh.svg"
                    width={140}
                    className="mx-auto"
                  />
                </button>
              </div>
              <div className="flex-1 flex flex-col h-full overflow-auto">
                <ul className="px-4 text-sm font-medium flex-1">
                  {navigation.map((item, idx) => (
                    <li key={idx}>
                      <button
                        href={item.href}
                        className="flex items-center w-full gap-x-2 text-gray-600 p-2 rounded-lg  hover:bg-gray-50 active:bg-gray-100 duration-150"
                        onClick={() => handleNavigationClick(item.route)}
                      >
                        <div className="text-gray-500">{item.icon}</div>
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
                <div>
                  <ul className="px-4 pb-4 text-sm font-medium">
                    {navsFooter.map((item, idx) => (
                      <li key={idx}>
                        <button
                          onClick={item.clickHandler}
                          className="flex items-center w-full gap-x-2 text-gray-600 p-2 rounded-lg  hover:bg-gray-50 active:bg-gray-100 duration-150"
                        >
                          <div className="text-gray-500">{item.icon}</div>
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="py-4 px-4 border-t">
                    <div className="flex items-center gap-x-4">
                      <img
                        src={user.user_metadata.picture}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <span className="block text-gray-700 text-sm font-semibold">
                          {user.user_metadata.name}
                        </span>
                        <a
                          href="javascript:void(0)"
                          className="block mt-px text-gray-600 hover:text-indigo-600 text-xs"
                        >
                          View profile
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </>
      }
      open={sidebar}
      docked={isAbove800px}
    >
      <div
        className="w-full h-[100vh]"
        style={{
          background:
            "linear-gradient(-10.6deg, rgba(251, 177, 56,0) 10.79%, rgba(219, 148, 31,0.1) 40.92%, rgba(219, 167, 81,0) 90.35%)",
        }}
      >
        {selectedRoute === "home" && (
          <HomeDashboard setSelectedRoute={setSelectedRoute} />
        )}
        {selectedRoute === "qr_links" &&
          restaurantId != null &&
          restaurantId != "" && <QRLinks restaurantId={restaurantId} />}
        {selectedRoute === "menu_edit" && (
          <CreateMenuDashboard
            user={user}
            restaurantId={restaurantId}
            paidPlan={paidPlan}
          />
        )}
        {selectedRoute === "plans" && (
          <Plans setSelectedRoute={setSelectedRoute} />
        )}
        <CheckUser
          user={user}
          onRestaurantIdChange={setRestaurantId}
          onPaidPlanChange={setPaidPlan}
        />
      </div>
    </Sidebar>
  );
}

export default Dashboard;
