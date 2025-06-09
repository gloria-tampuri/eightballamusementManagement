import React from "react";
import { MdArrowBackIos } from "react-icons/md";
import { useRouter } from "next/router";
import classes from "./back.module.css";

const Back = () => {
  const router = useRouter();

  return (
    <div>
      <MdArrowBackIos className={classes.icon} onClick={router.back} />
    </div>
  );
};

export default Back;
