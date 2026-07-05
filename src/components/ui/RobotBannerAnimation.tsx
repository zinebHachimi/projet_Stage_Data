"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export const RobotBannerAnimation = () => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");

  useEffect(() => {
    const message1 = "Hey how we can help you?";
    const message2 = "Can you please help me to creating the task?";

    let index1 = 0;
    let index2 = 0;

    const type1 = () => {
      if (index1 < message1.length) {
        setText1(message1.substring(0, index1 + 1));
        index1++;
        setTimeout(type1, 50);
      } else {
        setTimeout(type2, 500); // 500ms delay before second message starts typing
      }
    };

    const type2 = () => {
      if (index2 < message2.length) {
        setText2(message2.substring(0, index2 + 1));
        index2++;
        setTimeout(type2, 50);
      }
    };

    // Staggered typing start delay
    const startDelay = setTimeout(type1, 800);

    return () => clearTimeout(startDelay);
  }, []);

  return (
    <div className="banner-img-con position-relative">
      <figure className="mb-0">
        <Image
          src="/assets/images/banner-robot.png"
          alt="robot"
          width={732}
          height={765}
          priority
          className="animated-robot"
        />
      </figure>
      <div className="coment-box1 d-flex align-items-center popup-bubble popup-delay-1">
        <Image
          src="/assets/images/coment-box-icon1.png"
          alt="icon"
          width={35}
          height={26}
          className="img-fluid"
        />
        <p className="typing mb-0">{text1}</p>
      </div>
      <div className="coment-box2 d-flex align-items-center popup-bubble popup-delay-2">
        <Image
          src="/assets/images/coment-box-icon2.png"
          alt="icon"
          width={27}
          height={27}
          className="img-fluid"
        />
        <p className="typing mb-0">{text2}</p>
      </div>
    </div>
  );
};
