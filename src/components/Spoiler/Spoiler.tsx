import React, { useState } from 'react';
import clsx from "clsx"

import './style.scss';

type SpoilerProps = {
  title: string | React.ReactNode;
  children: React.ReactNode;
};

export const Spoiler: React.FC<SpoilerProps> = ({ title, children }) => {
  const [ open, setOpen ] = useState(false);
  const toggleOpen = () => { setOpen(!open); }

  return (
    <div className="spoiler" onClick={toggleOpen}>
        {title}
        <div className={clsx({ "display-none": !open, "spoiler-content": true })}>
          {children}
        </div>
    </div>
  );
}
