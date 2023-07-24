import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Supabase";
import { Auth } from "@supabase/auth-ui-react";
import {
  // Import predefined theme
  ThemeSupa,
} from "@supabase/auth-ui-shared";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const ScrollAnimatedComponent = ({ children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true, // Only trigger the animation once
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.5 }} // Adjust animation duration as needed
    >
      {children}
    </motion.div>
  );
};

function Login(props) {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for changes in authentication state
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user?.id) {
          console.log("Signed in:", session.user);
          props.setUser(session.user);
          navigate("/dashboard");
        }
      }
    );

    // Clean up the listener when the component is unmounted
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <ScrollAnimatedComponent>
      <main
        className="w-full h-screen flex flex-col items-center justify-center px-4"
        style={{
          background:
            "linear-gradient(-153.6deg, rgba(251, 177, 56,0) 10.79%, rgba(219, 148, 31,0.2) 60.92%, rgba(219, 167, 81,0) 90.35%)",
        }}
      >
        <div className="max-w-sm w-full text-gray-600 space-y-5">
          <div className="text-center pb-8">
            <img
              src="https://res.cloudinary.com/dewy2csvc/image/upload/v1689628008/DigiText_zfdjoh.svg"
              width={250}
              className="mx-auto"
            />{" "}
            <div className="mt-5">
              <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl ">
                Log in to your account
              </h3>
            </div>
          </div>
          <div className="p-12 rounded-2xl outline-none bg-white">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                style: {
                  button: { color: "black" },
                },
                className: {
                  anchor: "",
                  button: "supalogin_button",
                },
                variables: {
                  default: {
                    colors: {
                      brand: "transparent",
                      brandAccent: "orange",
                    },
                  },
                },
              }}
              redirectTo="https://digidish.vercel.app/dashboard"
              providers={[]}
            />
          </div>
        </div>
      </main>
    </ScrollAnimatedComponent>
  );
}

export default Login;
