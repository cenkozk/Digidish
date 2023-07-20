import { useEffect, useRef, useState } from "react";
import { supabase } from "../Supabase";

function CheckUser({ user }, onRestaurantIdChange, onPaidPlanChange) {
  const [restaurantId, setRestaurantId] = useState(null);
  const [paidPlan, setPaidPlan] = useState(null);

  useEffect(() => {
    // Check if the user already has data in the database

    if (!user.id) {
      return;
    }
    const checkUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("restaurant_id, paid_plan")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
      }

      // If the user has data in the database, set the restaurantId and paidPlan states
      if (data) {
        setRestaurantId(data.restaurant_id);
        setPaidPlan(data.paid_plan);

        // Pass the values to the parent component
        onRestaurantIdChange(user.restaurantId);
        onPaidPlanChange(user.paidPlan);
      } else {
        // If the user doesn't have data in the database, create a new record for the user
        const { data: newUserData, error: newUserDataError } = await supabase
          .from("users")
          .insert({ id: user.id, restaurant_id: null, paid_plan: null });

        if (newUserDataError) {
          console.error("Error creating new user data:", newUserDataError);
          return;
        }

        // Set the restaurantId and paidPlan states to null for the newly created user
        setRestaurantId(null);
        setPaidPlan(null);
      }
    };

    checkUserData();
  }, [user.id]);

  // You can use the restaurantId and paidPlan states as needed in your application

  return <></>;
}

export default CheckUser;
