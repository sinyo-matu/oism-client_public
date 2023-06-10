import { cssTransition } from "react-toastify";
import styled, { css, keyframes } from "styled-components";
import { Color } from "./Color";
export const fadeIn = keyframes`
  from {
    opacity:0;
  }

  to {
    opacity:1;
  }
`;

export const deriveFadeIn = (component: any, delay?: number) => {
  return styled(component)`
    opacity: 0;
    animation: ${fadeIn} 0.3s linear ${delay ? delay * 50 : 0}ms;
    animation-fill-mode: forwards;
  `;
};

export const ExpandTopDown = () => css`
  animation: ${expandTopDown} 0.2s linear;
  animation-fill-mode: forwards;
`;

export const PopUp = () =>
  css`
    animation: ${popUp} 0.2s ease;
  `;

export const PopUpGeneral = keyframes`
            0% {
              opacity:0;
              transform: scale(1);
            }

            80% {
              opacity:0.5;
              transform: scale(1.2);
            }

            100% {
              opacity:1;
              transform: scale(1);
            }

`;

export const PopUpWithRotate = keyframes`
            0% {
              opacity:0;
              transform: rotate(-25deg) scale(1);
            }

            80% {
              opacity: 0.5;
              transform:rotate(-25deg) scale(1.2);
            }

            100% {
              opacity: 1;
              transform:rotate(-25deg) scale(1);
            }

`;
const popUp = keyframes`
            0% {
              transform: scale(1);
              box-shadow: 0px 0px 3px ${Color.MAIN};
            }

            80% {
              transform: scale(1.1);
              box-shadow: 0px 0px 5px ${Color.MAIN};
            }

            100% {
              transform: scale(1);
              box-shadow: 0px 0px 3px ${Color.MAIN};
            }
`;

const expandTopDown = keyframes`
  from {
    transform-origin:top;
    transform :scaleY(0);
  }
  to {
    transform-origin:top;
    transform :scaleY(1);
  }
`;

export const expand = keyframes`
      0%{
        transform: scale(1) translateY(-5px);
        box-shadow: 0px 0px 3px ${Color.SUB};
      }
            100% {
              transform: scale(1.05) translateY(-5px);
              box-shadow: 0px 0px 8px ${Color.SUB};
            }
`;

export const blink = keyframes`
    0%{
      opacity:0.5;
    }

    50%{
      opacity:1;
    }

    100%{
      opacity:0.5;
    }
`;

export const customBounce = cssTransition({
  enter: "animate__animated animate__bounceIn animate__faster",
  exit: "animate__animated animate__bounceOut animate__faster",
});

export const customSlide = cssTransition({
  enter: "animate__animated animate__fadeInDown animate__faster",
  exit: "animate__animated animate__fadeOut animate__faster",
});
