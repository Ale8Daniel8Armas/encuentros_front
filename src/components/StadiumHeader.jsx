import React from "react";
import imagenDefault from "/src/assets/Portada_estadio.jpg";

const StadiumHeader = () => {
  return (
    <div className="flex-grow bg-white">
      <div className="mb-8 border-b">
        <img
          src={imagenDefault}
          alt="img de portada de estadio"
          className="w-full h-25 object-cover"
        />
      </div>
    </div>
  );
};

export default StadiumHeader;
