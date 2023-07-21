import { useEffect, useRef, useState } from "react";
import Steps from "./Steps";
import CreateMenu from "../components/CreateMenu";
import { nanoid } from "nanoid";

function CreateMenuDashboard(user) {
  const [steps, setStep] = useState({
    stepsItems: ["Information", "Categories", "Dishes", "Complete"],
    currentStep: 1,
  });

  console.log(user);
  const [restaurantId, setRestaurantId] = useState(null);
  const [paidPlan, setPaidPlan] = useState(null);

  useEffect(() => {
    if (user.restaurantId != null) {
      setRestaurantId(user.restaurantId);
    }
    setPaidPlan(user.paidPlan);
  }, [user]);

  //////////////////////////////////////////////////////////////////////

  const handleSteps = (num) => {
    setStep((prevSteps) => {
      return {
        ...prevSteps,
        currentStep: clampNumber(steps.currentStep + num, 1, 5),
      };
    });
  };

  const clampNumber = (num, a, b) =>
    Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

  const createMenuId = () => {
    setRestaurantId(nanoid(6));
  };

  return (
    <div className=" justify-center items-center flex w-full h-full">
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
              Get started by clicking the 'Create' button to begin the creation
              process.
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
    </div>
  );
}

export default CreateMenuDashboard;
