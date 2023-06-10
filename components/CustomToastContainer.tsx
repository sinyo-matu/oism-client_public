import React from "react";
import styled from "styled-components";
import { toast, ToastContainer, ToastContainerProps } from "react-toastify";
import { Color } from "../styles/Color";
import { customSlide } from "../styles/animation";

export const WrappedToastContainer = ({
  className,
  ...rest
}: ToastContainerProps & { className?: string }) => (
  <div className={className}>
    <ToastContainer {...rest} />
  </div>
);

export default styled(WrappedToastContainer).attrs({
  // custom props
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  newestOnTop: true,
  closeOnClick: true,
  hideProgressBar: true,
  rtl: false,
  draggable: true,
  pauseOnHover: false,
  transition: customSlide,
})`
  .Toastify__toast-container {
    z-index: 9999;
  }
  .Toastify__toast {
    border: 2px solid ${Color.MAIN};
    box-shadow: 0px 0px 3px ${Color.MAIN};
  }
  .Toastify__toast--error {
    border: 2px solid ${Color.Error};
    box-shadow: 0px 0px 3px ${Color.Error};
  }
  .Toastify__toast--warning {
    border: 2px solid ${Color.Warning};
    box-shadow: 0px 0px 3px ${Color.Warning};
  }
  .Toastify__toast--success {
    border: 2px solid ${Color.Success};
    box-shadow: 0px 0px 3px ${Color.Success};
  }
  .Toastify__toast-body {
    color: ${Color.Black};
  }
  .Toastify__progress-bar {
  }
`;
