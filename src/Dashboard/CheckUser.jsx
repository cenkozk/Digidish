import { useEffect, useRef, useState } from "react";
import { supabase } from "../Supabase";

function CheckUser(user) {
  useEffect(() => {
    // Check if the user already has data in the database
    if (!user.user.id) {
      return;
    }
    console.log(user);
    const checkUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("restaurant_id, paid_plan")
        .eq("id", user.user.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
      }
      // If the user has data in the database, set the restaurantId and paidPlan states
      if (data) {
        // Pass the values to the parent component
        user.onRestaurantIdChange(data.restaurant_id);
        user.onPaidPlanChange(data.paidPlan);
      } else {
        // If the user doesn't have data in the database, create a new record for the user
        const { data: newUserData, error: newUserDataError } = await supabase
          .from("users")
          .insert({ id: user.user.id, restaurant_id: "", paid_plan: "" });

        if (newUserDataError) {
          console.error("Error creating new user data:", newUserDataError);
          return;
        }

        // Set the restaurantId and paidPlan states to "" for the newly created user
        user.onRestaurantIdChange("");
        user.onPaidPlanChange("");
      }
    };

    checkUserData();
  }, [user.user.id]);

  // You can use the restaurantId and paidPlan states as needed in your application

  return <></>;
}

export default CheckUser;
