import { useEffect, useRef, useState } from "react";

function Plans() {
  return (
    <div className="w-max h-full mr-auto m-20 ml-24">
      <div className="flex flex-col items-center justify-center gap-10 select-none">
        <div class=" bg-white p-6 rounded-lg border flex flex-col items-center justify-center text-center z-30">
          <h5 className="z-20 text-lg bg-clip-text text-transparent bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-yellow-200 via-red-500 to-fuchsia-500 font-bold">
            Currently on the Free Plan <br />
            <span className=" text-3xl">$0 / mo</span>
          </h5>
        </div>
        <img
          src="https://res.cloudinary.com/dewy2csvc/image/upload/v1689966602/undraw_outer_space_re_u9vd_wbxodp.svg"
          className="z-0 w-80 h-80"
        />
      </div>
    </div>
  );
}

export default Plans;
