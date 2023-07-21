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
  const clampNumber = (num, a, b) =>
    Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

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

  const [steps, setStep] = useState({
    stepsItems: ["Information", "Categories", "Dishes", "Complete"],
    currentStep: 1,
  });

  console.log(restaurantId);

  //////////////////////////////////////////////////////////////////////

  const handleSteps = (num) => {
    setStep((prevSteps) => {
      return {
        ...prevSteps,
        currentStep: clampNumber(steps.currentStep + num, 1, 5),
      };
    });
  };

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

  const createMenuId = () => {
    setRestaurantId(nanoid(6));
  };

  //////////////////////////////////////////////////////////////////////

  const navigation = [
    {
      href: "javascript:void(0)",
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
      href: "javascript:void(0)",
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
      href: "javascript:void(0)",
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
                <a href="javascript:void(0)" className="flex ml-[-5px] mt-2">
                  <img
                    src="https://res.cloudinary.com/dewy2csvc/image/upload/v1689628008/DigiText_zfdjoh.svg"
                    width={140}
                    className="mx-auto"
                  />
                </a>
              </div>
              <div className="flex-1 flex flex-col h-full overflow-auto">
                <ul className="px-4 text-sm font-medium flex-1">
                  {navigation.map((item, idx) => (
                    <li key={idx}>
                      <a
                        href={item.href}
                        className="flex items-center gap-x-2 text-gray-600 p-2 rounded-lg  hover:bg-gray-50 active:bg-gray-100 duration-150"
                      >
                        <div className="text-gray-500">{item.icon}</div>
                        {item.name}
                      </a>
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
        className="w-full h-[100vh] relative"
        style={{
          background:
            "linear-gradient(-10.6deg, rgba(251, 177, 56,0) 10.79%, rgba(219, 148, 31,0.1) 40.92%, rgba(219, 167, 81,0) 90.35%)",
        }}
      >
        {restaurantId == null && (
          <div className="w-full relative h-full flex flex-col justify-center items-center scale-90">
            <div role="status">
              <svg
                aria-hidden="true"
                class="w-8 h-8 mr-2 text-gray-200 animate-spin  fill-orange-400"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        )}
        {restaurantId && (
          <div className="w-full relative h-full flex flex-col mt-[10vh] items-center scale-90">
            <h3 className="text-gray-800 mb-16 text-3xl font-semibold sm:text-4xl">
              Create Your Menu
            </h3>
            <Steps steps={steps} />
            <div class="inline-flex items-center justify-center w-full"></div>
            <CreateMenu
              steps={steps}
              handleSteps={handleSteps}
              restaurantId={restaurantId}
              user={user}
              paidPlan={paidPlan}
            />
          </div>
        )}
        {restaurantId == "" && (
          <div className="w-full relative h-full flex flex-col justify-center items-center scale-90">
            <div class="bg-white border border-gray-200  rounded-lg p-8 md:p-12 mb-8 scale-90">
              <a
                href="#"
                class="bg-orange-300 text-gray-900 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="1em"
                  width="1em"
                  className="mr-1"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M4.222 3.808l6.717 6.717-2.828 2.829-3.89-3.89a4 4 0 010-5.656zm10.046 8.338l-.854.854 7.071 7.071-1.414 1.414L12 14.415l-7.071 7.07-1.414-1.414 9.339-9.339c-.588-1.457.02-3.555 1.62-5.157 1.953-1.952 4.644-2.427 6.011-1.06s.892 4.058-1.06 6.01c-1.602 1.602-3.7 2.21-5.157 1.621z" />
                </svg>
                Create your first menu!
              </a>
              <h1 class="text-gray-900  text-3xl md:text-5xl font-extrabold mb-2">
                Create your first menu with hassle-free process.
              </h1>
              <p class="text-lg font-normal text-gray-500 mb-6">
                Get started by clicking the 'Create' button to begin the
                creation process.
              </p>
              <button
                onClick={() => {
                  createMenuId();
                }}
                class="inline-flex justify-center items-center py-2.5 px-5 text-base font-medium text-center text-white rounded-lg bg-orange-400 hover:bg-orange-300 "
              >
                Create
                <svg
                  class="w-3.5 h-3.5 ml-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </button>
            </div>
          </div>
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
