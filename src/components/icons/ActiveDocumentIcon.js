import React from "react";
import PropTypes from "prop-types";

const ActiveDocumentIcon = ({ className }) => {
	return (
		<svg className={className} width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M13.191 0H4.81C1.77 0 0 1.78 0 4.83V15.16C0 18.26 1.77 20 4.81 20H13.191C16.28 20 18 18.26 18 15.16V4.83C18 1.78 16.28 0 13.191 0Z" fill="#1A87FF" />
			<path fill-rule="evenodd" clip-rule="evenodd" d="M5.07996 4.65002V4.66002C4.64896 4.66002 4.29996 5.01002 4.29996 5.44002C4.29996 5.87002 4.64896 6.22002 5.07996 6.22002H8.06896C8.49996 6.22002 8.84996 5.87002 8.84996 5.42902C8.84996 5.00002 8.49996 4.65002 8.06896 4.65002H5.07996ZM12.92 10.74H5.07996C4.64896 10.74 4.29996 10.39 4.29996 9.96002C4.29996 9.53002 4.64896 9.17902 5.07996 9.17902H12.92C13.35 9.17902 13.7 9.53002 13.7 9.96002C13.7 10.39 13.35 10.74 12.92 10.74ZM12.92 15.31H5.07996C4.77996 15.35 4.48996 15.2 4.32996 14.95C4.16996 14.69 4.16996 14.36 4.32996 14.11C4.48996 13.85 4.77996 13.71 5.07996 13.74H12.92C13.319 13.78 13.62 14.12 13.62 14.53C13.62 14.929 13.319 15.27 12.92 15.31Z" fill="white" />
		</svg>
	);
};

ActiveDocumentIcon.propTypes = {
	className: PropTypes.string,
};

ActiveDocumentIcon.defaultProps = {
	className: "",
};

export default ActiveDocumentIcon;
