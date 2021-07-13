import React from "react";
import PropTypes from "prop-types";

const RightArrowIcon = ({ className }) => {
    return (
        <svg
            className={className}
            width="16"
            height="14"
            viewBox="0 0 16 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.80584 11.9621C7.43972 12.3282 7.43972 12.9218 7.80584 13.2879C8.17195 13.654 8.76555 13.654 9.13166 13.2879L14.7567 7.66291C15.1228 7.2968 15.1228 6.7032 14.7567 6.33709L9.13166 0.712088C8.76555 0.345971 8.17195 0.345971 7.80584 0.712088C7.43972 1.0782 7.43972 1.6718 7.80584 2.03791L11.8304 6.0625L1.90625 6.0625C1.38848 6.0625 0.96875 6.48223 0.96875 7C0.96875 7.51777 1.38848 7.9375 1.90625 7.9375L11.8304 7.9375L7.80584 11.9621Z"
                fill="currentColor"
            />
        </svg>
    );
};

RightArrowIcon.propTypes = {
    className: PropTypes.string,
};

RightArrowIcon.defaultProps = {
    className: "",
};

export default RightArrowIcon;
