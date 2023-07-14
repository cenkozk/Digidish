import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";

function Data_insert() {
  async function insertRestaurantMenu() {
    try {
      var id = nanoid(7);

      const restaurantMenu = {
        restaurantName: "Example Restaurant",
        categories: [
          {
            categoryName: "Appetizers",
            dishes: [
              {
                dishName: "Chicken Wings",
                description: "Crispy chicken wings with your choice of sauce.",
                price: 9.99,
                imageUrl: "https://example.com/wings.jpg",
              },
              {
                dishName: "Mozzarella Sticks",
                description:
                  "Fried mozzarella sticks served with marinara sauce.",
                price: 7.99,
                imageUrl: "https://example.com/mozzarella.jpg",
              },
            ],
          },
          {
            categoryName: "Main Course",
            dishes: [
              {
                dishName: "Steak",
                description: "Juicy grilled steak cooked to perfection.",
                price: 19.99,
                imageUrl: "https://example.com/steak.jpg",
              },
              {
                dishName: "Pasta Alfredo",
                description:
                  "Creamy pasta with Alfredo sauce and your choice of toppings.",
                price: 12.99,
                imageUrl: "https://example.com/pasta.jpg",
              },
            ],
          },
        ],
      };

      const { data, error } = await supabase.current
        .from("menu")
        .insert([{ id, menuJson: restaurantMenu }]);

      if (error) {
        console.error("Error inserting restaurant menu:", error);
        return;
      }

      console.log("Restaurant menu inserted successfully:", data);
    } catch (error) {
      console.error("Error inserting restaurant menu:", error);
    }
  }

  // Call the function to insert the restaurant menu

  useEffect(() => {
    insertRestaurantMenu();
  }, []);

  return <div></div>;
}

export default Data_insert;
