import { cn } from '@/lib/cn';
import { SVGAttributes } from 'react';

type IconProps = SVGAttributes<SVGSVGElement> & {
  color?: string;
};

export function IconLoading({ color = 'white', ...svgProps }: IconProps) {
  return (
    <svg
      {...svgProps}
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill={color}
      className={cn('size-4 animate-spin ', svgProps.className)}
    >
      <path d="M8 4C8 3.20887 7.7654 2.43552 7.32588 1.77772C6.88635 1.11992 6.26164 0.607232 5.53073 0.304482C4.79983 0.00173133 3.99556 -0.077482 3.21964 0.0768589C2.44371 0.2312 1.73098 0.612163 1.17157 1.17157C0.612163 1.73098 0.2312 2.44371 0.0768589 3.21964C-0.077482 3.99556 0.00173134 4.79983 0.304482 5.53073C0.607232 6.26164 1.11992 6.88635 1.77772 7.32588C2.43552 7.7654 3.20887 8 4 8V6.44095C3.51723 6.44095 3.04529 6.29779 2.64388 6.02957C2.24247 5.76136 1.92961 5.38013 1.74486 4.93411C1.56011 4.48809 1.51177 3.99729 1.60596 3.5238C1.70014 3.0503 1.93262 2.61536 2.27399 2.27399C2.61536 1.93262 3.0503 1.70014 3.52379 1.60596C3.99729 1.51177 4.48809 1.56011 4.93411 1.74486C5.38013 1.92961 5.76136 2.24247 6.02957 2.64388C6.29779 3.04529 6.44095 3.51723 6.44095 4H8Z" />
    </svg>
  );
}

export function IconFilter() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.3 7.57999H15.72C15.33 7.57999 15.02 7.26999 15.02 6.87999C15.02 6.48999 15.33 6.17999 15.72 6.17999H21.3C21.69 6.17999 22 6.48999 22 6.87999C22 7.26999 21.69 7.57999 21.3 7.57999Z"
        fill="#D6BD9F"
      />
      <path
        d="M6.42 7.57999H2.7C2.31 7.57999 2 7.26999 2 6.87999C2 6.48999 2.31 6.17999 2.7 6.17999H6.42C6.81 6.17999 7.12 6.48999 7.12 6.87999C7.12 7.26999 6.8 7.57999 6.42 7.57999Z"
        fill="#D6BD9F"
      />
      <path
        d="M10.1399 10.83C12.3215 10.83 14.0899 9.06152 14.0899 6.87999C14.0899 4.69847 12.3215 2.92999 10.1399 2.92999C7.95842 2.92999 6.18994 4.69847 6.18994 6.87999C6.18994 9.06152 7.95842 10.83 10.1399 10.83Z"
        fill="#D6BD9F"
      />
      <path
        d="M21.3 17.81H17.58C17.19 17.81 16.88 17.5 16.88 17.11C16.88 16.72 17.19 16.41 17.58 16.41H21.3C21.69 16.41 22 16.72 22 17.11C22 17.5 21.69 17.81 21.3 17.81Z"
        fill="#D6BD9F"
      />
      <path
        d="M8.28 17.81H2.7C2.31 17.81 2 17.5 2 17.11C2 16.72 2.31 16.41 2.7 16.41H8.28C8.67 16.41 8.98 16.72 8.98 17.11C8.98 17.5 8.66 17.81 8.28 17.81Z"
        fill="#D6BD9F"
      />
      <path
        d="M13.86 21.07C16.0416 21.07 17.81 19.3015 17.81 17.12C17.81 14.9385 16.0416 13.17 13.86 13.17C11.6785 13.17 9.91003 14.9385 9.91003 17.12C9.91003 19.3015 11.6785 21.07 13.86 21.07Z"
        fill="#D6BD9F"
      />
    </svg>
  );
}

export function IconMenu(svgProps: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      {...svgProps}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 6H21M3 12H21M3 18H21"
        stroke="#D6BD9F"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconX({ color = 'white', ...svgProps }: IconProps) {
  return (
    <svg
      {...svgProps}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5281 0.863281H14.9438L9.66753 6.90931L15.875 15.1367H11.0151L7.20856 10.1459L2.8527 15.1367H0.436063L6.07948 8.66938L0.125 0.863281H5.10889L8.54928 5.42389L12.5281 0.863281ZM11.6816 13.6877H13.0203L4.38045 2.23648H2.94523L11.6816 13.6877Z"
        fill={color}
      />
    </svg>
  );
}

export function IconLocked() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.5 5.83333V4.66666C3.5 2.73583 4.08333 1.16666 7 1.16666C9.91667 1.16666 10.5 2.73583 10.5 4.66666V5.83333"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.00008 10.7917C7.8055 10.7917 8.45842 10.1387 8.45842 9.33333C8.45842 8.52792 7.8055 7.875 7.00008 7.875C6.19467 7.875 5.54175 8.52792 5.54175 9.33333C5.54175 10.1387 6.19467 10.7917 7.00008 10.7917Z"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.91675 12.8333H4.08341C1.75008 12.8333 1.16675 12.25 1.16675 9.91667V8.75C1.16675 6.41667 1.75008 5.83334 4.08341 5.83334H9.91675C12.2501 5.83334 12.8334 6.41667 12.8334 8.75V9.91667C12.8334 12.25 12.2501 12.8333 9.91675 12.8333Z"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconOutErrorCircle({ className }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM15.36 14.3C15.65 14.59 15.65 15.07 15.36 15.36C15.21 15.51 15.02 15.58 14.83 15.58C14.64 15.58 14.45 15.51 14.3 15.36L12 13.06L9.7 15.36C9.55 15.51 9.36 15.58 9.17 15.58C8.98 15.58 8.79 15.51 8.64 15.36C8.35 15.07 8.35 14.59 8.64 14.3L10.94 12L8.64 9.7C8.35 9.41 8.35 8.93 8.64 8.64C8.93 8.35 9.41 8.35 9.7 8.64L12 10.94L14.3 8.64C14.59 8.35 15.07 8.35 15.36 8.64C15.65 8.93 15.65 9.41 15.36 9.7L13.06 12L15.36 14.3Z"
        fill="#EE5F67"
      />
    </svg>
  );
}

export function IconDefaultGrid({ isActive }: { isActive: boolean }) {
  if (isActive) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.08335 11.0417H8.95835V17.9167H6.50835C5.07455 17.9167 3.98017 17.4909 3.24465 16.7554C2.50913 16.0199 2.08335 14.9255 2.08335 13.4917V11.0417Z"
          fill="#EC1751"
          stroke="#EC1751"
          strokeWidth="0.833333"
        />
        <path
          d="M17.9167 6.50834V8.95834H11.0417V2.08334H13.4917C14.9255 2.08334 16.0199 2.50911 16.7554 3.24463C17.4909 3.98015 17.9167 5.07453 17.9167 6.50834Z"
          fill="#EC1751"
          stroke="#EC1751"
          strokeWidth="0.833333"
        />
        <path
          d="M8.95835 2.08334V8.95834H2.08335V6.50834C2.08335 5.07453 2.50913 3.98015 3.24465 3.24463C3.98017 2.50911 5.07455 2.08334 6.50835 2.08334H8.95835Z"
          fill="#EC1751"
          stroke="#EC1751"
          strokeWidth="0.833333"
        />
        <path
          d="M18.3333 10.625V13.4917C18.3333 16.525 16.525 18.3333 13.4917 18.3333H10.625V10.625H18.3333Z"
          fill="#EC1751"
        />
      </svg>
    );
  }

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.2">
        <path
          d="M7.50002 18.3333H12.5C16.6667 18.3333 18.3334 16.6666 18.3334 12.5V7.49996C18.3334 3.33329 16.6667 1.66663 12.5 1.66663H7.50002C3.33335 1.66663 1.66669 3.33329 1.66669 7.49996V12.5C1.66669 16.6666 3.33335 18.3333 7.50002 18.3333Z"
          stroke="white"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 1.66663V18.3333"
          stroke="white"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.66669 10H18.3334"
          stroke="white"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function IconGridCustom({ isActive }: { isActive: boolean }) {
  if (isActive) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.0959 6.08329C2.17081 4.86422 2.57792 3.91607 3.23344 3.25474C3.88812 2.59426 4.82916 2.18092 6.04169 2.09844V6.08329H2.0959Z"
          fill="#EC1751"
          stroke="#EC1751"
          strokeWidth="0.833333"
        />
        <path
          d="M16.7666 3.25474C17.4221 3.91607 17.8292 4.86422 17.9041 6.08329H13.9584V2.09844C15.1709 2.18092 16.1119 2.59426 16.7666 3.25474Z"
          fill="#EC1751"
          stroke="#EC1751"
          strokeWidth="0.833333"
        />
        <path
          d="M13.9584 14H17.8989C17.8098 15.1915 17.3995 16.1184 16.7471 16.7657C16.0938 17.4141 15.1597 17.8199 13.9584 17.9016V14Z"
          fill="#EC1751"
          stroke="#EC1751"
          strokeWidth="0.833333"
        />
        <path
          d="M6.04169 14V17.9016C4.84035 17.8199 3.90623 17.4141 3.2529 16.7657C2.60055 16.1184 2.1902 15.1915 2.10117 14H6.04169Z"
          fill="#EC1751"
          stroke="#EC1751"
          strokeWidth="0.833333"
        />
        <path
          d="M2.08335 8.16667H6.04169V11.9167H2.08335V8.16667Z"
          fill="#EC1751"
          stroke="#EC1751"
          strokeWidth="0.833333"
        />
        <path d="M18.3334 7.75H13.5417V12.3333H18.3334V7.75Z" fill="#EC1751" />
        <path d="M12.2916 7.75H7.70831V12.3333H12.2916V7.75Z" fill="#EC1751" />
        <path
          d="M12.2916 1.66663H7.70831V6.49996H12.2916V1.66663Z"
          fill="#EC1751"
        />
        <path
          d="M12.2916 13.5834H7.70831V18.3334H12.2916V13.5834Z"
          fill="#EC1751"
        />
      </svg>
    );
  }
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.2">
        <path
          d="M7.50002 18.3333H12.5C16.6667 18.3333 18.3334 16.6667 18.3334 12.5V7.5C18.3334 3.33334 16.6667 1.66667 12.5 1.66667H7.50002C3.33335 1.66667 1.66669 3.33334 1.66669 7.5V12.5C1.66669 16.6667 3.33335 18.3333 7.50002 18.3333Z"
          stroke="white"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.69171 7.08333H18.3334"
          stroke="white"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.69171 12.9167H18.3334"
          stroke="white"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.09167 18.325V1.67499"
          stroke="white"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.925 18.325V1.67499"
          stroke="white"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function IconDownload() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.99992 5.33337L4.66659 5.33337C3.19383 5.33337 1.99992 6.52728 1.99992 8.00004L1.99992 11.3334C1.99992 12.8061 3.19382 14 4.66658 14L12.6666 14C14.1393 14 15.3333 12.8061 15.3333 11.3334L15.3333 8.00004C15.3333 6.52728 14.1393 5.33337 12.6666 5.33337L11.3333 5.33337"
        stroke="black"
        strokeLinecap="round"
      />
      <path
        d="M6.66675 8.66663L8.19534 10.1952C8.45569 10.4556 8.8778 10.4556 9.13815 10.1952L10.6667 8.66663"
        stroke="black"
        strokeLinecap="round"
      />
      <path d="M8.66675 10L8.66675 2" stroke="black" strokeLinecap="round" />
    </svg>
  );
}

export function IconCorrect() {
  return (
    <svg
      width="10"
      height="8"
      viewBox="0 0 10 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.868042 4L3.61943 6.75139L9.13193 1.24861"
        stroke="black"
        strokeWidth="1.45833"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSearch() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.66659 14C11.1644 14 13.9999 11.1645 13.9999 7.66667C13.9999 4.16887 11.1644 1.33334 7.66659 1.33334C4.16878 1.33334 1.33325 4.16887 1.33325 7.66667C1.33325 11.1645 4.16878 14 7.66659 14Z"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6666 14.6667L13.3333 13.3333"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconConfirmed({ color }: { color?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
        stroke={color || 'white'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.75 12L10.58 14.83L16.25 9.17"
        stroke={color || 'white'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconDiscord(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      {...props}
      className={cn("w-[22px] h-[22px]", props.className)}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.6642 4.88579C16.445 4.31746 15.125 3.90496 13.75 3.66663C13.7258 3.66697 13.7028 3.67685 13.6859 3.69413C13.5209 3.99663 13.3284 4.39079 13.2 4.69329C11.7416 4.47343 10.2585 4.47343 8.80003 4.69329C8.67169 4.38163 8.47919 3.99663 8.30503 3.69413C8.29586 3.67579 8.26836 3.66663 8.24086 3.66663C6.86586 3.90496 5.55503 4.31746 4.32669 4.88579C4.31753 4.88579 4.30836 4.89496 4.29919 4.90413C1.80586 8.63496 1.11836 12.265 1.45753 15.8583C1.45753 15.8766 1.46669 15.895 1.48503 15.9041C3.13503 17.1141 4.72086 17.8475 6.28836 18.3333C6.31586 18.3425 6.34336 18.3333 6.35253 18.315C6.71919 17.8108 7.04919 17.2791 7.33336 16.72C7.35169 16.6833 7.33336 16.6466 7.29669 16.6375C6.77419 16.4358 6.27919 16.1975 5.79336 15.9225C5.75669 15.9041 5.75669 15.8491 5.78419 15.8216C5.88503 15.7483 5.98586 15.6658 6.08669 15.5925C6.10503 15.5741 6.13253 15.5741 6.15086 15.5833C9.30419 17.0225 12.705 17.0225 15.8217 15.5833C15.84 15.5741 15.8675 15.5741 15.8859 15.5925C15.9867 15.675 16.0875 15.7483 16.1884 15.8308C16.225 15.8583 16.225 15.9133 16.1792 15.9316C15.7025 16.2158 15.1984 16.445 14.6759 16.6466C14.6392 16.6558 14.63 16.7016 14.6392 16.7291C14.9325 17.2883 15.2625 17.82 15.62 18.3241C15.6475 18.3333 15.675 18.3425 15.7025 18.3333C17.2792 17.8475 18.865 17.1141 20.515 15.9041C20.5334 15.895 20.5425 15.8766 20.5425 15.8583C20.9459 11.7058 19.8734 8.10329 17.7009 4.90413C17.6917 4.89496 17.6825 4.88579 17.6642 4.88579ZM7.81003 13.6675C6.86586 13.6675 6.07753 12.7966 6.07753 11.7241C6.07753 10.6516 6.84753 9.78079 7.81003 9.78079C8.78169 9.78079 9.55169 10.6608 9.54253 11.7241C9.54253 12.7966 8.77253 13.6675 7.81003 13.6675ZM14.1992 13.6675C13.255 13.6675 12.4667 12.7966 12.4667 11.7241C12.4667 10.6516 13.2367 9.78079 14.1992 9.78079C15.1709 9.78079 15.9409 10.6608 15.9317 11.7241C15.9317 12.7966 15.1709 13.6675 14.1992 13.6675Z"
        fill="white"
      />
    </svg>
  );
}